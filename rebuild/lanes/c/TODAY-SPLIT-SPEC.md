# TODAY-SPLIT-SPEC v3 - extracting the WRITERS, measured: the cut is a table and a script, the census is a machine's

Lane C, ticket TODAY-SPLIT-SPEC, ROUND 2, **FIX ROUND after review R1**. Author: cowork (Earned lane
hand, lane C); the v1 and v2 authors are gone and this document continues their work rather than
replacing it. Branch `rebuild/c-today-split`. SPEC ONLY: this round authors this one file and moves
no product, test, tooling or workflow byte.

**Review R1 (`TODAY-SPLIT-SPEC-REVIEW-R1.md` at `af53fd17`) rejected v2 with nine blocking findings
and seven notes, and upheld the PM's direction.** Every one is carried out or disputed with evidence
in the new section **"R1 findings: fixed or disputed"** immediately after the change log, and the
section that carries each fix is edited in place rather than corrected in an erratum. Where the fix
changes an interface, the old text is gone, not annotated.

**The ref.** Every line number in this document is read at the chain tip `c15a69c0`
(`rebuild/t2-client-core`, farm-synced for this round, privacy proof PASS), not at v1's `724ef3f`.
The two refs agree on every region boundary I re-measured in `today-app.cjs` and `today-model.cjs`;
where a line number in this document differs from v1's or from one of the two input maps, the
difference is named where it occurs and this ref is the one that stands. **The fix round re-read
every line it disputes or re-cites at `e0e2ac75`**, the tip the reviewer used; the reviewer's own
`git diff c15a69c0 e0e2ac75 -- rebuild/m3/w7-preview/today/` is EMPTY, so the two refs agree byte
for byte over every file this document cites and every line number below is valid at both.

Read before this: `DECISIONS:536` (the release and its rule), `DECISIONS:542` (R2 REJECT, PM-R1
to PM-R9, and (C), the TODAY-SPLIT ruling), `DECISIONS:543` (S-R1 to S-R9, the direction) and
`DECISIONS:546` (S9 judged R3 REJECT; **the copy lock made a named PRECONDITION OF S10**, which is
the child that carries this split: G.4); `rebuild/lanes/b/S9-RELEASE-SPEC.md` sections A, B and D
at `d859096a` on `rebuild/b-s9-ui-pins`; the blind map
`/home/claude/farm/scratch/split/blind-map.md`; the look-versus-seal map
`/home/claude/farm/scratch/look-vs-seal/MAP.md`; `rebuild/lanes/c/ui-port/C-UI-1.md` .. `C-UI-8.md`.

---

## v1 to v2: what changed and why

v1 extracted the VIEW: about 1700 lines of drawing left `today-app.cjs` for five new free modules,
`today-app.cjs` kept `mountToday`, the router and all seventeen writer regions, and stayed SEALED.
PM4 reversed the direction (ruling S-R1): the WRITERS leave, into one new SEALED module, and
`today-app.cjs` keeps its name, its `mountToday`, its router, its drawing and its copy, and is
RELEASED through the `released` role S9 builds. This version carries that out.

**What v1 got right and is kept here.** Its method (A.0), its region map (A.1, A.2), its crossing
binding census (A.3), the writer-fence (E), the `today-model.cjs` section (F) and the sequencing (G)
are careful work. They are marked KEPT FROM v1 where they stand, with every line the new direction
changes named inside the section rather than in a separate erratum.

**What is new.** Sections B and C are written from nothing. D, E, F, G and H are re-aimed.

**The seven things I found that neither v1 nor either map says, and that the build round needs.**

1. **The move is 670 lines, not the look map's 455 and not v1's 560.** The look map's nine
   regions omit five writer regions and every writer statement in the module body. B.2 reconciles
   the three counts region by region, as S-R1 requires. (v2 said 663; the fix round's six named
   deltas are printed under B.2's total.)
2. **There is a second interface, in the other direction, and it is not optional.** The sealed half
   must be able to repaint, to read the router's cursor and the mount token, to write the status
   line and to clear the view's draft: `openSleepLane:531` and `:537` already read `screen` and call
   `render`, and `recordSleep` compares `mountToken` five times. B.4 names it the PAINT HANDLE,
   bounds it to five paint-only functions, and shows why handing it across is safe when handing a
   writer the other way is not.
3. **The writer must stop composing sentences, and that is the change that frees C-UI-7.**
   `recordSleep`'s `say` (`:1812`) sets one of nine module-level copy constants on eleven paths.
   Under the new direction the writer returns a typed OUTCOME and the released view maps outcome to
   sentence, so no copy moves, `VIEW_SOURCES` does not change, and `design.test.cjs:79-81` and
   `copy.test.mjs:406` need no edit at all. B.6 lists the six outcome shapes.
4. **`today-app.cjs` must keep `createTodayModel` on its export surface**, because `today-entry.mjs`
   is pinned on disk and reads it there (`today-entry.mjs:44`). A released file therefore names a
   model factory. B.7 disposes of it with a measured re-export rule the fence asserts, not an
   exception.
5. **The import and measure routes' dynamic imports must move too.** `renderImport:713` holds
   `import("../import/import-screen.mjs")`, and `rebuild/m3/w7-preview/import/**` is SEALED by
   `:536` by name. A released file may not hold the door to the admission path. That costs one
   edit to `build.mjs:391` and one to the sealed cell `package.test.cjs:105`, both re-points.
6. **The test edit list is THREE, not zero and not nine.** Two sealed cells slice a writer out of
   `today-app.cjs` by its declaration text (`food.test.mjs:1153`, `problem.test.mjs:1100-:1101`) and
   one plants an import edge on it (`package.test.cjs:105`). Every one is a file-name re-point that
   keeps the assertion's teeth. ZERO import paths change. D.3 lists them with their new values.
7. **The `released` role can carry a file that is edited in the same package, and the S10 author
   must be told WHY on purpose.** A released entry has `pre` = the parent's pin and `post: null`,
   and walk 1 re-asserts it in Git at `sourceBase`, never on disk at HEAD
   (`S9-RELEASE-SPEC.md` at `:1829-:1833` and its B.4). So the package that releases
   `today-app.cjs` may change it in the same breath, and the seal will say nothing about the new
   bytes - by design, which is exactly the trade `:536` recorded. G.4 states it out loud so no S10
   reviewer discovers it.

**What I refuse or qualify in the PM's own reasons.** Named here and argued where they are carried
out: reason (c) is understated, reasons (e) and (f) need a correction, and clause S-R2's
"refusal decisions for anything that gets stored live in the sealed half" cannot be met in full in
this round without scope the PM has not granted. H.5 holds all four with their evidence.

---

## R1 findings: fixed or disputed

Review R1 (`TODAY-SPLIT-SPEC-REVIEW-R1.md`, `af53fd17`) returned REJECT with nine blocking findings
and seven notes, and a direction verdict that the PM's reversal is RIGHT and should stand. **I
accept the verdict.** I re-measured every blocking finding myself at `e0e2ac75` rather than take it
on trust, and every one of the nine is real at the lines it cites. Two I have WIDENED, because the
reviewer's own line of attack reaches further than the finding states. Two of the seven notes I
DISPUTE, with the measurement.

| finding | verdict | carried out in |
|---|---|---|
| BLOCKING-1 the facade cannot be called `view` | FIXED | B.3 (the names, measured), B.7 (the `model.` census re-counted) |
| BLOCKING-2 the gesture guard throws on the first paint | **FIXED and WIDENED** | B.3 (the two callback classes), E.6 (the guard's subject list, the new red cell) |
| BLOCKING-3 the spread breaks `api.ready`, the order and a key | FIXED | B.7 (the api written out, twenty keys, in order), H.2 stop 7 |
| BLOCKING-4 the router's range, and `:2297` | FIXED | B.2 row 29 re-cut, B.3 `on.forgetCheckInRead`, SEAM 10 |
| BLOCKING-5 six released-to-sealed writes on the sleep screen | FIXED | B.3 (two new callbacks), B.5, SEAM 9 |
| BLOCKING-6 `sleepNightChoice` is read by the write path | FIXED | B.5 (it moves SEALED), B.3 |
| BLOCKING-7 the openers leak a lane | FIXED | B.3 (the opener return shape), B.5, B.7, SEAM 8 |
| BLOCKING-8 the gym extraction is self-contradictory | FIXED | B.9, rewritten: facade, table, painter, the edit token, SEAM G1 |
| BLOCKING-9 a fourth test edit | **FIXED by a different means** | B.3 (the engine crosses by reference), D.3, H.2 stop 5 |
| N1 cite errors | **one DISPUTED, four fixed** | below, and in place |
| N2 `.filter(Boolean)` | FIXED | B.6 row 10, char for char |
| N3 SEAM 2's trace | FIXED | B.8 SEAM 2 |
| N4 the S9 round-3 reject and the copy lock | FIXED | G.4, and the header's reading list |
| N5 the estimate is low | ACCEPTED, and raised further | H.4 |
| N6 the answers to Q1 to Q5 | agreed; Q3's framing taken from the reviewer | H.6 |
| N7 E.4's re-decision of v1's Q7 | undisturbed | E.4 |

### The two findings I WIDENED

**BLOCKING-2 reaches the BOOT, not only the first paint.** The reviewer's guarded list keeps
`openSetup`, `openCheckIn` and `openWorkout` inside the gesture guard. Those three are called from
the ROUTER, and the router is called from the boot: `today-app.cjs:2451` is
`render(requestedScreen() || (setupFirst && firstRun() ? "setup" : "today"))`, and `:2300` is
`if (next === "setup") { return setup.open({ doc, phone, back: ... })`. So on a fresh installation
the FIRST thing the page does is enter the setup screen from boot, with no DOM event anywhere in
the stack. Guarding `on.openSetup` does not throw on the first paint of Today; it throws on the
first boot of a new device, which is worse. The fix therefore splits the table into two classes by
what a callback DOES (B.3) rather than by where the reviewer found it being called, and the ENTRY
class covers the three router entries as well as the three lane openers and the two reads.

**BLOCKING-8's `settingsErrors` contradiction is a DESIGN constraint, not a typo.** The WeakMap is
keyed by the DRAFT OBJECT, and the draft object is the released editor's own state (`gym-app.mjs:262`
mints it, `:271` reads the message back, `:279` hands it to the writer). A WeakMap in the seal keyed
by an object the view mints would work, but it would put the view's repaint message inside the seal
for no gain and it would keep the seal holding a reference to a released object for the life of the
mount. So the fix is not to pick one side of v2's contradiction: `settingsDraft`, `settingsDraftLift`
and `settingsErrors` all stay RELEASED, exactly as `sleepDraft` does on the Today side and for the
same reason the file already gives at `today-app.cjs:475` ("The screen's own transient state.
Nothing durable lives here"), and the STALE-EDITOR FENCE that used their identity is rebuilt in the
seal on a token the seal mints (B.9). That changes what moves out of `gym-app.mjs`, so B.9's count
is re-derived rather than corrected.

### The two notes I DISPUTE, with the measurement

> **ROUND 3: THE FIRST OF THESE TWO DISPUTES IS WITHDRAWN.** R2 BLOCKING-7 re-measured it and R1 was
> right: the array holds **48** elements, 26 of them `today/**`. The paragraph below is kept as the
> record of what v2 argued and of the method that produced the wrong number - extracting every
> quoted literal from a range that contains comment blocks with quoted strings and apostrophes in
> it. The live numbers are in B.10 and D.3, under S-R18: **48 becomes 51, and the `today/` literal
> becomes 29.** A spec that disputes a reviewer with a measurement must be right, and this one was
> not.

**N1 row 1 is wrong: `REQUIRED_INPUTS` has 51 entries, not 48, and v2's "51 becomes 53" stands.**
The reviewer read `build.mjs:98` and counted 48. Counted at `e0e2ac75` by reading the array from
`const REQUIRED_INPUTS = Object.freeze([` at `:98` to its closing `])` at `:201` and extracting every
quoted literal: **51 entries, of which 26 are `today/**`**. The reviewer's `today/**` figure of 26 is
right and is the same measurement, which is why I think the 48 is a truncated read of the array
rather than a different definition. B.10 is unchanged: 51 becomes 53.

**N1 row 5 is right about the count and I am restating it rather than disputing it**, because v2's
sentence "eleven sealed cells import the same surface" was mine and it is wrong. Measured: SEVEN
cells import `today-app.cjs` (`checkin.test.mjs:25`, `copy.test.mjs:34`, `food.test.mjs:21`,
`gym.test.mjs:33`, `problem.test.mjs:23`, `setup.test.mjs:28`, `view.test.mjs:21`), two more name it
as a literal (`design.test.cjs:80`, `package.test.cjs:104`), and THREE import `today-model.cjs` only
(`adapter.test.mjs:21`, `machine-settings-ui.test.mjs:31`, `ntc-h6-delta.test.mjs:61`). The PM's
"eleven test files import today-app.cjs" is eleven files that import one or the other. The
conclusion - zero import paths change - is unaffected and is now stated over the right census (D.3).

**N5's band I accept and then exceed.** The reviewer's 42 to 58 was costed against the nine findings
as findings. The fixes below add three named seams, a second facade and paint handle for gym, an
api written out key by key, three sealed in-flight flags and the edit token. H.4 is restated at
**44 to 60 build, 12 to 16 review**, and the per-ticket-freed comparison is restated with it.

### Direction: the reviewer's verdict, recorded for the PM

The ticket asks that if the reviewer's direction verdict argued v1's direction was better, the
author record the argument and NOT switch direction. **It did not: R1's verdict is "extracting the
WRITERS is BETTER than extracting the view. The PM's ruling should stand."** Its scoring, recorded
here so the PM has it without reading the review: v2 wins size of the move, test churn, residue for
the look tickets and future reseal cost; v1 wins data safety, regression risk of the refactor and
contention in one file; and the reviewer reads the net as favouring v2 because "the two v1 wins are
both about the TRANSITION, and both are bounded by proofs this spec already specifies well", while
"the four v2 wins are permanent properties of the RESULT".

**The one column the PM should still weigh, in the reviewer's own terms.** On DATA SAFETY the
reviewer scores v1 "and it is not close", and names seven lines that decide whether or what gets
written and that v2 left in a file six look tickets may edit: the rollover guard cleared at `:1540`
and `:1561`; the acknowledgment dropped at `:1542`; the two in-flight `disabled` guards at `:1069`
and `:1287`; the check-in cache invalidation at `:2297`; the mount invalidation at `:2296`; the
landing decision at `:2451`. **All seven are disposed of by name in this version** - `:1540`,
`:1541`, `:1542`, `:1561` and `:1562` through `on.sleepNightChosen` and `on.keepNight` (SEAM 9);
`:2297` through `on.forgetCheckInRead` (SEAM 10); `:1069` and `:1287` by a SEALED in-flight flag per
writer with an `{ kind: "in-flight" }` outcome, the DOM `disabled` staying as paint beside it (B.8);
`:2451` by `facade.setupFirst()`, which also restores the one-handoff rule. `:2296`'s
`mountToken += 1` stays released ON PURPOSE and with the file's own reason: `:1921-:1926` says
"Ownership governs PAINTING and NAVIGATION ... it never governs the record" (B.4).

So the reviewer's closing sentence - "the released half still holds the rollover guard, the
acknowledgment, the two in-flight flags and the check-in cache, and each of those must move or be
fenced by name before the claim 'no released file decides whether a write happens' can be made" - is
the specification of this fix round, and C.3 and E.3 now make that claim over a list rather than in
the abstract.

---

## R2 findings: fixed or disputed, each against a spike row (ROUND 3)

Round 3 is written FROM the measured tables of `rebuild/lanes/c/today-split-spike/`, under the PM's
S-R10 to S-R18. The diagnosis it answers is S-R17's: two rounds of a HAND census of closure bindings
each missed crossings the next reviewer found by reading, and a hand census of 76 closure bindings in
a 2625-line file does not converge. The spike replaces it with four instruments and four tables:

| instrument | what it produces | where |
|---|---|---|
| `gen-regions.cjs` | `regions.json`, the REGION TABLE: 65 regions of the three files, each anchored by the exact TEXT of its first and last line plus an occurrence index, with tip line numbers kept only as a cross-check | S-R17 (a) |
| `cut.cjs` | the CODEMOD: it moves regions verbatim, applies only DECLARED substitutions, refuses on an anchor that matches zero or ambiguously, on overlapping regions, and on any region boundary that falls INSIDE a statement | S-R17 (b), (g) |
| `census.cjs` | `CROSSINGS.md`: scope analysis (acorn 8 + eslint-scope 8) over the codemod's OUTPUT. Every reference that resolves to no declaration in the file it now sits in IS a crossing | S-R17 (c) |
| `reach.cjs` | `REACH.md`: from the paint roots and the listener roots to every durable writer call site, so ENTRY against DURABLE is a measurement | S-R17 (d) |

**The headline numbers, and they are identical at the chain tip and at the S9 lane head
`da9f8683`:** 65 of 65 regions resolve by content anchor, 0 ambiguously; 762 lines move (685 + 41 +
36); 5 substitution rows; 0 regions whose bytes differ with no declared row; `node --check` 6 of 6;
**282 crossing references, 100 distinct direction+name**; 62 reachability rows; **exactly ONE durable
PUT that any paint root reaches**.

**What I re-ran myself, and what I did not.** I re-ran all three commands at the CURRENT chain tip
`70113da5` (the spike measured at `fdd773d5`; the diff between them is `DECISIONS:550` and the STATUS
line and touches neither of the three files this ticket cuts). `CROSSINGS.md` and `REACH.md`
regenerate BYTE FOR BYTE identical to the committed copies apart from the one line that records the
worktree path. I re-ran the whole today step on the F.1 wired output at that tip. I did NOT re-run
the pure-move overlay, and I did not re-run the S9 ref; those two rows are the spike's and are
labelled as such wherever this spec leans on them.

### R2's eight blocking findings

| R2 | verdict | the row that proves it |
|---|---|---|
| **BLOCKING-1** B.5's census misses the `:1435` write of `sleepCheckInViewPending` | **FIXED, and the class it belongs to is now measured** | `CROSSINGS.md`: `sleepCheckInViewPending write today-app.cjs:1435, sits in TA-M07, declared in TA-S09 at :474`. It is one of **25 RELEASED ASSIGNS A SEALED BINDING rows in 8 regions**, not one line. It is a declared seam (TA-M07) and one of the three the ALIGNMENT CHECK flags: the statement runs `:1435-:1444`, so R2 is right that it is a seam and not a line. B.5 now carries all 25 |
| **BLOCKING-2** E.6's ENTRY-class cell contradicts itself; four ENTRY bodies would RED it | **FIXED, upheld in substance by a different route** | `REACH.md`: the four ENTRY callbacks reach **no PUT at all**. `openFoodLane` reaches `host.all():603` (STORE) and `model.setFoodDays():605` (ADOPT); `openSleepLane` reaches `:520` (STORE) and `:522` (ADOPT); `readSleepCheckIn` reaches `host.forDate():1416` (STORE); `loadCheckInKit` reaches `Promise.all`, which the receiver filter marks "not a store". The fix is E.3's three-way split (PUT / STORE / ADOPT) and the ENTRY class then survives its own cell |
| **BLOCKING-3** `gym-app.mjs:546` `model.start()` is called from `paint()` | **FIXED by naming it, not by solving it** | `REACH.md`, `gym-app.mjs:546 model.start() in paint [paint SYNC, boot SYNC, listener SYNC]`. It is the ONLY durable PUT any paint root reaches, at both refs. Under S-R12 it is a pre-existing fact, named out loud, left byte-identical, carried as its own later ticket, and NOT fixed inside a pure move. `start` comes OFF the guarded list with that reason written down (E.6) |
| **BLOCKING-4** the api literal names a sealed binding, and hands out a second writer-capable object | **FIXED, and the file has a SECOND api R2 did not reach** | `CROSSINGS.md`: `importScreen read :2556` and `workout read :2568`, both inside TA-M14, both declared sealed. And `gym-app.mjs:569-:579` `first.settings` hands out FIVE sealed bindings including `lane: () => settingsLane` - a second returned api, in a file B.9 never says has an api at all (B.7, B.9) |
| **BLOCKING-5** B.2 rows 30 and 31 and SEAMS 6 and 7 carry range errors | **FIXED in the table, which is now the instruction** | `regions.json`: TA-M12 `:2349-:2351` with the note "branch is `:2343-:2354`"; TA-M13 `:2364-:2365`, "branch is `:2359-:2374`". I verified both bounds in the source: `:2343 if (next === "recovery") {`, `:2354 }`, `:2355` and `:2356` are the MEASURE and IMPORT routes; `:2359 if (next === "workout") {`, `:2374 }`. The ranges are no longer prose a build round reads; they are anchors a script resolves |
| **BLOCKING-6** `sleepClockCheck` cannot move whole; D.1 permits no substitution for it | **FIXED, and the spike gives a cheaper disposition than R2 proposes** | `CROSSINGS.md`: `sleepTyped call today-app.cjs:1386, sits in TA-S26, declared RELEASED at :1378`. That is a **SEALED CALLS A RELEASED FUNCTION** row, one of 34 in 7 names, and the disposition for that whole class is an INJECTED reference, not a substitution. So `sleepClockCheck` moves BYTE-IDENTICAL, `recordSleep:1813`'s argument-free call is untouched, and **no W8 is needed**. R2's finding is right and its two proposed fixes are both more expensive than the measurement allows (B.3, D.1) |
| **BLOCKING-7** `REQUIRED_INPUTS` is 48, not 51 | **FIXED. R1 and R2 are right and the dispute is withdrawn** | I re-measured at the current tip: lines matching `^\s*"rebuild/` between `:98` and `:201` number **48**, of which **26** contain `w7-preview/today/`. The author's 51 counted quoted literals inside the comment blocks the array carries. Under S-R18: 48 becomes **51** with three new modules, and H18's `today/` literal becomes **29**, which makes `package.test.cjs` a declared S10 edit (B.10, D.3) |
| **BLOCKING-8** the fence's word list gives three false positives, one of them a real leak | **FIXED, and the two instruments are separated** | The leak is a CENSUS row, not a reach row: `importScreen read :718` and `:719`, sitting in TA-M03, declared sealed in TA-S20 at `:688`. `regions.json` carries TA-M03 `:718-:719` as its own declared seam, which is what R2 asks for. The `reach.cjs` row at `:718` that looks like a paint-reached PUT is `.reopen` on E.3's PUT word list with the receiver filter saying "not a store": the right instrument for that line is the census (E.4, E.6) |

### R2's notes

R2 carries **eleven numbered notes**; the PM's dispatch says twelve, and the twelfth is best read as
NOTE-10's three cite corrections, which are tabled separately below. All fourteen rows are disposed
of.

| R2 | verdict | the row |
|---|---|---|
| **NOTE-1** `lanes` is not 0 in code: `:2196` `lanes: laneHandles(),` | **FIXED** | Accepted without dispute. It is a property key, so it causes no fault, but the census is the evidence the name was chosen on. B.3 now states the count as "0 in code POSITION, 1 as a property key at `:2196`" rather than 0 |
| **NOTE-2** B.4 says five paint entries and B.5 says six; strike `paintTodayEntry` from W4 | **FIXED, and the machine says what replaces it** | `CROSSINGS.md`: `screen` is read in six moved regions - TA-S13 `openSleepLane`, TA-S18 `openFoodLane`, TA-S19 `measureDeps`, TA-S20 `importDeps`, TA-S27 `readSleepCheckIn` and **TA-S34 `rebindWorkout`** (`:2080`, `:2083`). `paintTodayEntry` is not one of them: it is a `paintTodayEntry` CALL from TA-S22 at `:785`, which is the paint-handle entry, not a `screen` reader. W4's region list is corrected to those six (D.1) |
| **NOTE-3** SEAM 2's throw-path trace contradicts its own placement | **FIXED by decision** | Not a measurement question; the spike does not settle it and does not pretend to. B.8's SEAM 2 now fixes the order as today's - `[check, disable, check-sealed, save-throws, readBack-set, enable, repaint]`, which is `:1295`, `:1297`, `:1298` - and moves `render(...)` OUT of the moved region into the view's "after" half. The trace cell asserts that order |
| **NOTE-4** B.2 is short by `session()`, `checkinSummary()`, `firstRun()` | **FIXED** | `regions.json` TA-S01 `:362-:365` carries `session()`; TA-S02 `:370-:384` carries `checkinSummary()` and `firstRun()`. Both notes are in the table's own notes column. The census then shows why they had to move: `session` is CALLED from released code at `:887`, `checkinSummary` at `:2251`, `firstRun` at six sites |
| **NOTE-5** the gym card has no sealed in-flight flag and B.3's argument says it needs four | **ACCEPTED, and narrowed by measurement** | `REACH.md` says `logSet:419`, `finish:444`, `forget:498` and `undo:505` are listener-reached and nothing else, so they are DURABLE and guarded; the released `busy` flag is their only duplicate guard today. B.3's sealed in-flight flag is extended to all four, which is four more `if (busy) return` pairs, priced in H.4 |
| **NOTE-6** `food.test.mjs:1152-:1153` imposes a declaration ORDER constraint | **FIXED** | `regions.json` orders TA-S17 `foodEntryFor` `:569-:591` BEFORE TA-S18 `openFoodLane` `:593-:618`, and `cut.cjs` emits moved regions in table order, so the constraint is carried by the table rather than by a sentence. D.3 names it |
| **NOTE-7** B.7's re-export of `createTodayModel` is unnecessary under F.1's own fork | **ACCEPTED** | B.7 now states the fork: under F.1 (the sibling, recommended) `today-model.cjs` is RELEASED and `today-app.cjs:16` keeps its own require unchanged, so the re-export and E.5 row 7 belong ONLY to F.1 (d). The RE-EXPORT RULE stays in E.3 because `createTodayLanes` still needs it |
| **NOTE-8** G.4 should cite S9's own argv measurement | **FIXED** | G.4 now cites `S9-RELEASE-SPEC.md:160-:161` at `da9f8683`: `packages/S8.json` declares 25 children with 68 distinct argv targets and every one of the 68 is a test cell, so `today-app.cjs` is not a child argv target |
| **NOTE-9** the estimate is again low; R2's band is 50 to 66 build | **ACCEPTED in direction and RE-COST from the other side** | H.4 is rebuilt from the spike: the MOVE is now a script that has been run, so 762 lines of cut and paste come off the estimate and the seams, the interface module, the boot order and the fence go on. My band is **51 to 67 build, 12 to 16 review**, and the review comes DOWN from R2's band for one measured reason: the census the last two reviewers had to re-derive by hand is now three commands that take a minute |
| **NOTE-10 (a)** B.7 cites `module.exports` `:2600-:2624` | **FIXED**: `:2600-:2625` | R1 had it right |
| **NOTE-10 (b)** SEAM 9 cites `:1536-:1538` | **FIXED**: `:1535-:1537`; `:1538` is the `addEventListener` | `regions.json` TA-M08 is `:1539-:1542`, which is the assignment block only |
| **NOTE-10 (c)** B.9 cites `refuse()`'s DOM half as `:292-:294` | **FIXED**: `:292` is a comment, `:293-:294` is the DOM half | Immaterial to the split, and corrected in B.9 |
| **NOTE-11** what R2 agrees with the author about | **RECORDED** | `mountToken += 1` at `:2296` stays released: S-R15 rules it and B.4 keeps the file's own words. Q1, Q2, Q4, Q5 and Q7 are ruled as recommended (S-R10 to S-R16) |

### Where the spike contradicts the spec or a review, and the spike wins

Ten rows neither the spec nor either review carries. Each is a measured row and each has a
disposition in the section named.

| # | what the machine found | disposed of in |
|---|---|---|
| 1 | `gym-app.mjs:279` `settingsSaving = recordSettings(map, view, paintedDraft);` is a RELEASED assignment of a binding B.9 moves sealed at `:125` - the R1 BLOCKING-5 shape in the second file | B.9, B.5 |
| 2 | `gym-app.mjs:569-:579` `first.settings` is a SECOND returned api handing out five sealed bindings, one of them `lane: () => settingsLane` | B.7, B.9 |
| 3 | `lastMessage` is assigned at FIVE sites (`:383`, `:388`, `:392`, `:396` in `weighIn`, `:402` in `reopen`), not the three F.1 prices | F.1, D.1 |
| 4 | `reopen` calls the released `read()` at `today-model.cjs:404` - a SEVENTH injection F.1 omits, and the wired build does not go green without it | F.1 |
| 5 | `clearSleepDraft` is called from `retrySleepRead` (`:1743`, `:1752`) as well as `recordSleep` (`:1870`, `:1919`), which D.1's W3 permits in `recordSleep` only | D.1 |
| 6 | `screen`'s sixth moved reader is `rebindWorkout`, not `paintTodayEntry` | D.1 W4, B.4 |
| 7 | `retrySleepRead` composes athlete-facing copy; the full measurement is **12 distinct released copy constants across 22 references**, in TA-S23 `recordIntake`, TA-S29 `retrySleepRead` and TA-S30 `recordSleep` | B.6 |
| 8 | `ready` is read by a released drawing region, `renderMeasure:668` `try { await ready; }` | B.5, B.7 |
| 9 | `sleepErrorText` is read by released code at `:1657` and `:1658`, which B.5's disposal row does not name | B.5, B.6 |
| 10 | **33 module-level names cross** (16 names: 4 requires and 12 copy constants), counted nowhere in the spec | B.5, B.6 |

**And the BOOT ORDER, which no round has looked at.** `cut.cjs` prints it. `mountToday` has 13
executable statements at its own top level and the cut moves 6 of them, INTERLEAVED with released
ones: `:353-:356` released, `:422` `:482` `:567` MOVED, `:2390` released, `:2440-:2441` MOVED,
**`:2451` released - the first paint**, `:2550` MOVED, `:2552` released. B.3 calls the factory once,
"immediately after the three element handles", and a single call there runs `:2550` before `:2451`,
which moves `settleAdoption`'s synchronous `adoptionSettled = !adopting` to before the first paint,
and `paintTodayEntry:770` reads that flag. B.3 resolves it. `gym-app.mjs` has 10 top-level statements
with 2 moved (`:138`, `:139`), and they are contiguous, so the gym card's boot has no such problem.

---

## A. THE MAP - KEPT FROM v1, with the counts reconciled

### A.0 Method, and what I did not do - KEPT FROM v1, extended

v1's tokenizer method and its warning stand unchanged, and so does the blind map's independent
tokenizer (blind map section 0, which found and fixed a real bug in its own first pass). I added
nothing to the tooling. For v2 I re-read, at `c15a69c0` and by hand: `today-app.cjs:352-:2625`
region head by region head (the full declaration list, 120 regions), the three seams line by line,
the router `:2272-:2380`, the boot `:2430-:2551`, the returned api `:2552-:2619`,
`today-model.cjs:150-:200` and `:355-:430`, `gym-app.mjs:108-:182` and `:286-:322`,
`machine-settings-view.mjs:1-:60`, `food-model.cjs:30-:64`, the four lane hosts' DOM census, and
every sealed cell line that names `today-app.cjs` or `gym-app.mjs` as a literal.

I ran no test suite, no `b-package.cjs` and no build: this lane is spec only. I opened no sealed
file outside the inventory this ticket names, and no file on the owner's data path.

### A.1 and A.2, the region maps - KEPT FROM v1 unchanged

v1's A.1 (the twelve regions above `mountToday`) and A.2 (the region-by-region map of `mountToday`)
are the cut list and they are kept verbatim in substance. I re-derived the region heads at
`c15a69c0` and they agree with v1's table at every boundary I checked. Two corrections, both small:

- v1's A.2 marks **eighteen** rows `WRITES` and then says "Counted: 17 WRITES regions". The table is
  right and the sentence is wrong. The eighteen are listed in B.2 below.
- The look map's `3.3` puts the weigh-in refusal paint at `today-app.cjs:1077`. At `c15a69c0`,
  `:1076` is `error.textContent = plainOrDrop(result.copy || ..., "weigh-error")` and `:1077` is
  `input.focus()`. v1's `:1076` is the right line.

### A.3 The crossing bindings - KEPT FROM v1, and mostly dissolved by the new direction

v1 counted 33 crossing bindings; the blind map counted 31 over the same scope. The difference is
bookkeeping (v1 groups `sleepOpening`/`sleepSaving`/`sleepLaneFailure` as one row and splits
`workoutRebinding`; the blind map does the reverse) and neither count is wrong. **Both tables are
kept as the acceptance test of the cut**, and B.5 walks every binding in them by name under the new
direction.

The important thing S-R1 (d) claims and I can now confirm: under the new direction a crossing
binding is no longer a design problem in general, because the two halves no longer need a frozen
snapshot to pass between them. The view READS through a live read-only facade and WRITES nothing;
the sealed half writes and reads its own state. Twenty-five of v1's 33 become plain facade getters
with no snapshot, no clone and no freeze. What remains is the eight bindings B.5 disposes of by
name, and they are a smaller set than v1's four hard ones plus the `sleepDraft` family, because
`mountToken`, `screen`, `checkinOrigin`, `todayEntry`, `adoptionSettled`, `sleepDraft` and the five
sleep intent flags all end up on the side of the fence that already owns them.

### A.4 `today-model.cjs` - KEPT FROM v1 unchanged

v1's A.4 table stands. Section F re-decides what moves out of it, and only that.

---

## B. THE CUT (NEW - S-R1, S-R2, S-R3, S-R4)

### B.1 The direction, in six lines (S-R1)

1. `today-app.cjs` keeps its NAME, `mountToday`, the router `render`, every DRAWS and BINDS
   READ-ONLY region, all 351 lines of prologue and copy, the whole export surface, and the drawing
   half of the boot. It is **RELEASED** in the same artifact that carries the split.
2. ONE new module, `rebuild/m3/w7-preview/today/today-lanes.cjs`, is **SEALED** (`role: new`). It
   takes every lane opener, every host and IndexedDB handle, the adoption gate and chain, the
   rebind, and every call of a durable writer: **685 lines in 38 measured regions**, 679 after B.3's
   five boot seams (B.2, and the table is `regions.json`).
3. `gym-app.mjs` keeps its name and is RELEASED; ONE new module,
   `rebuild/m3/w7-preview/today/gym-settings-lane.mjs`, is SEALED and takes the settings lane:
   **41 lines in four measured regions, plus six seams** (S-R4, B.9; the editor's draft and its
   error map stay RELEASED, which is R1 BLOCKING-8).
4. The sealed module exports ONE factory. It hands the view a frozen READ-ONLY FACADE (`facade`), a
   frozen CALLBACK TABLE (`on`), **and `lanes.api`, a third object that exists only to serve the
   mount surface `today-entry.mjs` pins** (S-R2, B.3, B.7). Two of `lanes.api`'s entries -
   `sleepLane()` and `workoutEntry()` - return writer-capable objects BY REFERENCE, and the gym
   card's `first.settings.lane()` is a third. All three are measured, named and fenced by E.5 red
   row 14. **That is a qualification of S-R2's "two frozen things and nothing else", and it is
   stated here where the ruling is carried out rather than only in B.7 where it is measured**
   (R2 BLOCKING-4 (c)).
5. The view hands the sealed module a frozen PAINT HANDLE (`painter`) of **six** paint-only functions
   for Today and two for the gym card, plus two injected pure helpers and three constructor
   arguments, and nothing else - and that is now a MEASUREMENT, not a design choice: the census
   finds exactly five released bindings the seal reads and seven released functions it calls (B.5).
   Nothing that can write crosses toward the view in either direction, and **no released file
   ASSIGNS a sealed binding**, which is a class in `CROSSINGS.md` whose acceptance number is ZERO
   (B.5, E.3).
6. `today-model.cjs`'s two durable writers move to a small sealed sibling; its projection, its
   `read()`, and the S2 composer `marchingOrderSentence` stay free (F, S-R3).
### B.2 What moves, as a TABLE and not as prose (S-R17 (a))

**The region table is `rebuild/lanes/c/today-split-spike/regions.json` and this section does not
restate it by hand.** That is the change S-R17 makes and the reason for it is two rounds old: R1
corrected one of B.2's ranges, R2 corrected three more two rows away from it, and the spec's own
appendix item 8 conceded that the other 100 regions were never re-read. A range written in prose is
re-read by a human every round and is wrong about one row in ten. A range anchored by the exact TEXT
of its first and last line is resolved by a script, at any ref, and refuses rather than drifts.

**What a row is.** Every region carries `id`, `kind` (`move` or `seam`), `dest`, a `first` and `last`
anchor (the line's exact text plus an occurrence index), a `note` naming the B.2 row or the review
finding it comes from, and `tipLines`, **which are a cross-check and never the instruction**.

| file | move regions | lines moved | seam regions | released file after |
|---|---|---|---|---|
| `today-app.cjs` -> `today-lanes.cjs` | 38 (`TA-S01` to `TA-S38`) | **685** | 14 (`TA-M01` to `TA-M14`) | 1941 lines (1942 at S9) |
| `gym-app.mjs` -> `gym-settings-lane.mjs` | 4 (`GA-S01` to `GA-S04`) | **41** | 6 (`GA-M01` to `GA-M06`) | 548 lines |
| `today-model.cjs` -> `today-readings.cjs` | 3 (`TM-S01` to `TM-S03`) | **36** | 0 | 428 lines (461 at S9) |
| **total** | **45** | **762** | **20** | |

**726 of the 762 moved lines move byte for byte with nothing applied to them at all.** The other 36
are `today-model.cjs`'s three regions, which carry the five declared substitution rows (D.1).

**Resolution, at both refs.** 65 of 65 regions resolve by content anchor; 0 anchors match zero places
or ambiguously. At the chain tip every region resolves at its tip line numbers with no drift. At
`da9f8683` 30 regions resolve one line lower and `today-model.cjs`'s three resolve 32 lines lower,
which is the whole point of anchoring by content: the same table applies at the chain tip, at the S9
lane head where `today-app.cjs:869` and `today-model.cjs` already differ, and after the design lane
edits a drawing region.

**How 685 reconciles with v2's 670, exactly, because the two numbers count different things.**

| | lines |
|---|---|
| B.2 v2's whole-move total ("601 move whole") | 601 |
| plus **two regions no B.2 row ever carried**: `TA-S21` `adoptionSettled` `:767` (1) and `TA-S22` `settleAdoption` `:775-:790` (16). B.5 says both move; B.2 never tabled them | +17 |
| plus the comment blocks and declaration boundaries an ANCHORED range includes and v2's "code lines" column did not (for example `TA-S14` is `:543-:555`, 13 lines, where B.2 row 6 counted `:551-:555`, 5) | +67 |
| **the machine's total** | **685** |

And the seams change quantity, not just count: **v2's ten seams were 69 lines counted INTO the 670.
The machine's twenty seams move NOTHING.** A seam region is an annotation of a place where the
RELEASED half decides something, not a cut; `cut.cjs` leaves every seam line where it is. So the
honest form is: 685 lines leave `today-app.cjs`, 14 places in what remains are seams, and the build
round's work at a seam is to write the callback, not to move the line.

**Where the look map's 455 and v1's 560 come from, and why both are low.** Unchanged from v2's
analysis and now measured rather than argued: both count named WRITES regions and miss the module
body's own statements, the router's branches, the shared state block and the adoption chain. The
machine's 685 includes all four. **No build round should plan against 455, 560, 663 or 670.**

**The three regions that are NOT a pure move, found by the ALIGNMENT CHECK and not by reading.**
`cut.cjs` parses each file and refuses any region whose boundary falls inside a statement, because
that is the failure `node --check` cannot catch: both halves of a cut declaration can still parse.
At the current tip it reports **3 straddling seam markers and 17 aligned ones**:

| region | boundary | the statement it falls inside |
|---|---|---|
| `TA-M07` (SEAM 11, R2 BLOCKING-1) | ENDS at `:1435` | a BlockStatement running `:1435-:1444` |
| `TA-M11` (SEAM 5) | ENDS at `:2336` | a BlockStatement running `:2300-:2337`; B.8 gives `:2300-:2336` |
| `GA-M02` | ENDS at `:419` | a VariableDeclaration running `:419-:420`; B.9 gives `model.logSet` as `:419` |

A fourth was corrected INTO the table before it could be a straddle: **F.1 gives `OUT_OF_RANGE` as
`today-model.cjs:373`; the declaration runs `:373-:374`, and a region cut at `:373` leaves
`+ " lb, to one decimal place. Nothing was recorded.";` behind as a valid unary-plus expression
statement that `node --check` passes.** `TM-S01` is `:365-:374`. I verified all four in the source at
the current tip.

**Seventeen of the twenty seams ALIGN**, which is the useful half of that measurement: they are
candidates for pure moves, and what makes them seams is not syntax but what the released half
DECIDES. That is the assignment census, and it is B.5's.

### B.3 The interface, DERIVED from the census (S-R2, S-R17 (c) and (f))

Every group below is a class in `CROSSINGS.md`. The interface is not designed and then checked; it is
READ OFF the 282 crossings, and a name that is not in a class here is a name the machine did not
find.

| census class | refs | names | what it becomes |
|---|---|---|---|
| released reads a sealed binding | 119 | 45 | the READ-ONLY FACADE `facade` |
| released calls a sealed function | 42 | 24 | the CALLBACK TABLE `on` |
| **RELEASED ASSIGNS A SEALED BINDING** | **25** | **17** | callbacks that TAKE the write (B.5), and the eight regions they sit in are the seam STOPs |
| sealed reads a released binding | 29 | 5 | the PAINT HANDLE and two constructor arguments (B.4) |
| sealed calls a released function | 34 | 7 | the PAINT HANDLE and two injected pure helpers (B.4) |
| module-constant the sealed half re-requires | 33 | 16 | four `require`s and twelve copy constants (B.6) |

**THE NAMES, with R2 NOTE-1 accepted.** `facade`, `on` and `painter` are 0 in code position in both
released files. `lanes` is 0 in code POSITION and **1 as a property key**, `today-app.cjs:2196`
`lanes: laneHandles(),` inside `problemState()`. A property key causes no TDZ fault the way a
rebound `view` would, but the census is the evidence the name was chosen on, so it is stated rather
than rounded to zero. The four names stand; R2 asked for the correction, not for a fifth name.

**THE READ-ONLY FACADE: 45 names, and the list is `CROSSINGS.md`'s RELEASED -> SEALED read rows.**

| group | the names the machine found |
|---|---|
| `today-model.cjs`'s own six, which belong to F.1 and not to `today-lanes.cjs` | `weighIn` and `reopen` (read at `:426`, the returned object's keys), `ALREADY_RECORDED`, `FORM_MIN`, `FORM_MAX`, `OUT_OF_RANGE` (read at `:455`) |
| the three injected entries, as RESULTS only | `session()`, `checkinSummary()`, `firstRun()`, `setup`, `checkin`, `workout`, `workoutRebinding`, `setupFirst` |
| the food lane, as data | `foodLane`, `foodOpening`, `foodLaneFailure`, `foodReadBack`, `foodSaving` |
| the sleep lane, as data | `sleepLane`, `sleepOpening`, `sleepLaneFailure`, `sleepReadBack`, `sleepAck`, `sleepUnknown`, `sleepBusy`, `sleepSaving`, `sleepCorrecting`, `sleepRollover`, `sleepErrorText` (which becomes `sleepOutcome`, B.6) |
| the check-in | `checkInKit`, `checkInKitLoading`, `checkInLive`, `sleepCheckInDay`, `sleepCheckInRow`, `sleepCheckInPending`, `sleepCheckInFailed`, `sleepCheckInViewPending` |
| the screens and the adoption chain | `measureScreen`, `importScreen`, `importAdmitted`, `adoptionSettled`, `ready` |
| the gym card's own facade | `settingsLane`, `settingsOpening`, `settingsSaving`, `settingsRead`, `settingsReading` |

**ONE INSTRUMENT FACT, stated because it bounds the list.** Scope analysis sees BARE IDENTIFIERS.
`model.read()` is a member access on `model`, which the one-handoff rule keeps in scope in the
released file until the handoff, so the census does NOT count the projection reads: they are the
roughly 15 released `model.` code lines B.7 re-measured by hand, every one a READ and every one
rewritten `model.` to `facade.`. So the facade is **45 census names plus those 15 member reads**, and
the 15 are the one part of this interface that is still a reading census. The build round closes that
by running `census.cjs` a second time AFTER the handoff rewrite, when every one of them has become a
bare `facade` member and the machine can see it.

Every one is a function or a value; not one of them is, returns or closes over a writer, with the two
measured exceptions B.7 states by name (`sleepLane` and `workoutEntry` pass THROUGH the api) and the
gym card's third, `first.settings.lane`. `sleepSpanH` crosses BY REFERENCE, uncalled in the sealed
module, for the reason D.3 gives.

**THE CALLBACK TABLE: 24 names, and the list is `CROSSINGS.md`'s RELEASED -> SEALED call rows.**
`adoptAthleteState`, `armAdoptionGate`, `canAdoptAthleteState`, `checkinSummary`, `firstRun`,
`importDeps`, `loadCheckInKit`, `measureDeps`, `openFoodLane`, `openSettingsLane`, `openSleepLane`,
`readSleepCheckIn`, `reboundCheckIn`, `recordIntake`, `recordSleep`, `retryFoodRead`,
`retrySleepRead`, `session`, `settleAdoption`, `sleepClockCheck`, `sleepNightDate`, `sleepOpsFor`,
`sleepToday`, `startSettingsRead`. Four of those (`session`, `checkinSummary`, `firstRun`,
`sleepNightDate`) are pure reads and go on the FACADE as functions rather than on `on`; the rest are
callbacks. Every entry takes RAW FIELD VALUES and returns a result object; no entry takes or returns
a DOM node, a lane, a host or a promise minted anywhere but here.

**THE CLASSES, now a measurement and not a judgement (R2 BLOCKING-2, S-R12).** A callback is
**DURABLE** if and only if `REACH.md` shows it reaching a PUT, and **ENTRY** otherwise. The machine's
answer for the four callbacks R2 said would red the class cell: `openFoodLane` reaches `host.all()`
(STORE) and `model.setFoodDays()` (ADOPT); `openSleepLane` the same pair; `readSleepCheckIn` reaches
`host.forDate()` (STORE); `loadCheckInKit` reaches `Promise.all`, which is not a store at all. **None
of the four reaches a PUT**, so all four are ENTRY, and the ENTRY class survives its own cell once
E.3's word list is split three ways. Two more come OFF the DURABLE list by the same rule:
`retryFoodRead` calls `foodLane.refresh():1327` and `retrySleepRead` calls `sleepLane.refresh():1732`,
and both are STORE.

**`on.sleepClock()` TAKES NO ARGUMENT, and that is R2 BLOCKING-6 dissolved rather than paid for.**
R2 is right that `sleepClockCheck:1386` calls `sleepTyped()`, which reads the RELEASED `sleepDraft`,
and right that B.3's `on.sleepClock(typed)` signature would force an identifier substitution inside a
moved writer region, which D.1 forbids. The census classes that reference differently: it is a
**SEALED CALLS A RELEASED FUNCTION** row, one of 34 in 7 names, and the disposition for that entire
class is an INJECTED reference. `createTodayLanes` receives `sleepTyped` and `reasonOf` the way F.1's
sibling receives `read` and `stateFromOps`, so `sleepClockCheck` moves byte for byte, `:1386` is
untouched, and `recordSleep:1813`'s argument-free `sleepClockCheck()` is untouched too. **No W8 is
needed for it and D.1's manifest does not change.** The released `:1549` becomes `on.sleepClock()`.

**THE BOOT ORDER, which no round has looked at and which one factory call cannot preserve.**
`cut.cjs` prints it: `mountToday` has **13 executable statements at its own top level and the cut
moves 6**, interleaved with released ones.

```
:353 :354 :355 :356   released   (doc, phone, status, chrome)
:422                  MOVED  TA-S05   if (foodLane && ...) model.setFoodDays(foodLane);
:482                  MOVED  TA-S10   if (sleepLane && ...) model.setSleepNights(sleepLane);
:567                  MOVED  TA-S16   if (sleepLane) loadCheckInKit();
:2390                 released   (the #phone keydown listener)
:2440 :2441           MOVED  TA-S35   const willAdopt = canAdoptAthleteState(); if (willAdopt) armAdoptionGate();
:2451                 released   render(requestedScreen() || ...)   <-- THE FIRST PAINT
:2550                 MOVED  TA-S38   let ready = settleAdoption(willAdopt ? adoptAthleteState() : Promise.resolve(), willAdopt);
:2552                 released   the returned api
```

B.3 v2 calls the factory ONCE, "immediately after the three element handles". A single call there
runs `:2550` before `:2451`, which moves `settleAdoption`'s synchronous `adoptionSettled = !adopting`
to before the first paint, and `paintTodayEntry:770` reads that flag. Calling the factory at three
points breaks the one-handoff rule E.3 asserts. **So the resolution is neither: the factory
constructor contains DECLARATIONS AND FUNCTION DEFINITIONS ONLY, and the six boot statements stay at
the exact positions they occupy today as calls into `on`.**

| position | today | after |
|---|---|---|
| `:422` | `if (foodLane && ...) model.setFoodDays(foodLane);` | `on.adoptFoodDays();` (ADOPT, not durable: F.2) |
| `:482` | the sleep twin | `on.adoptSleepNights();` |
| `:567` | `if (sleepLane) loadCheckInKit();` | `on.loadCheckInKit();` (ENTRY) |
| `:2440-:2441` | `const willAdopt = ...; if (willAdopt) armAdoptionGate();` | `on.armAdoptionGate();` |
| `:2550` | `let ready = settleAdoption(...)` | `on.settleAdoption();`, which assigns the sealed `ready` |

**Five consequences the build round is told rather than left to find:**

1. **The region table gains five seams and loses five moves.** `TA-S05`, `TA-S10`, `TA-S16` and
   `TA-S38` change `kind` from `move` to `seam`, and `TA-S35` SPLITS: `:2430-:2439` stays a move (the
   two function declarations) and `:2440-:2441` becomes a seam. The table goes from 45 move / 20 seam
   to **40 move / 25 seam, and 679 lines move instead of 685**. The build round re-runs `cut.cjs`
   with that revision as its first act; the anchors are already in the table, so it is an edit to
   five `kind` fields and one range, not a re-derivation.
2. **`willAdopt` moves from a `const` in `mountToday` to a `let` at factory scope**, because `:2441`
   and `:2550` are now two separate calls separated by the first paint. That is one new declared
   substitution row, **W8**, and it is a statement rewrite, so it is an **S-R17 (g) STOP** and is
   declared as one in D.1.
3. **`ready` becomes sealed state with two assignment sites**, `on.settleAdoption()` at `:2550`'s
   position and the setup branch's `:2333` (already the seam `TA-M11`). It is read by released code
   at `:668` (`renderMeasure`'s `try { await ready; }`, which the spike found and no round carries),
   at `:2335` and at `:2576`. B.7's live accessor is what serves all three.
4. **The order is then identical by construction**, not by argument, and D.2b's listener census and
   D.2's DOM snapshots are what prove it.
5. **`gym-app.mjs` has no such problem.** Its boot is 10 top-level statements with 2 moved, `:138`
   and `:139`, and they are contiguous and carry no executable work.

**THE ONE-HANDOFF RULE, unchanged.** `createTodayLanes(model, options, painter)` is called once and
the released file never names `model` or `options` again: `createTodayLanes` 2, `createTodayModel` 2
(or 0 crossings under F.1's recommended fork, see B.7), `model` 2, `options` 2. `options.setupFirst`
at `:392` moves (`TA-S03`) and is served as `facade.setupFirst()`, which is what keeps `options` at 2.

**THE OPENERS RETURN A BOOLEAN, NOT A LANE**, unchanged from v2 and verified again by R2: `opening`
occurs in code at exactly `:1180` and `:1492` and is consumed for truthiness only at `:1181` and
`:1498`. `on.loadCheckInKit()` returns `undefined`.

**A SEALED IN-FLIGHT FLAG PER DURABLE WRITER, now seven and not three (R2 NOTE-5).** v2 gave
`on.submitWeighIn`, `on.recordIntake` and `on.recordSettings` a sealed `busy` flag because after the
cut their only duplicate-write guard is a DOM `disabled` flag in a released file. R2 is right that
the same argument covers the gym card's other four: `REACH.md` shows `logSet:419`, `finish:444`,
`forget:498` and `undo:505` reached from a listener and from nothing else, and their only guard today
is the RELEASED `busy` flag at `:417-:418`, in a file C-UI-4 edits. All seven open with
`if (<name>Busy) return { kind: "in-flight" };`, set before the await, clear in a `finally`, exactly
as `sleepBusy` is set at `:1830` and cleared at `:1918`. The view maps `in-flight` to nothing drawn.
About six lines each.

### B.4 The PAINT HANDLE: the other direction, bounded (new, and not optional)

The sealed half cannot be write-only. Three facts in the code force it:

- `openSleepLane:531` `if (screen === "today" || screen === "sleep") render(screen, false);` and
  `:537` the same on the failure path. A lane opener reads the router's cursor and repaints.
- `recordSleep` captures `const token = mountToken` at `:1839` and compares it at `:1852`, `:1872`,
  `:1880`, `:1886`, `:1896` and `:1928`. Every late write asks whether it may still paint.
- `adoptAthleteState:2545` reports its cause with `tell(athleteStateFailureCopy(error))`, and
  `recordSleep:1870`/`:1919` call `clearSleepDraft()`.

So the released half hands the factory ONE frozen object of exactly SIX functions, and the fence
asserts its shape. **Six, not v2's five: R2 NOTE-2 is right that B.4's literal and B.5's prose
disagreed, and the census settles it** - `paintTodayEntry` is a CALL the seal makes from `TA-S22` at
`:785`, so it is a handle entry, and it is NOT one of the six regions that read `screen` (that sixth
is `rebindWorkout`, which is D.1's W4, not this list):

```
const painter = Object.freeze({
  repaint: (name, focus) => render(name, focus),
  screenNow: () => screen,
  token: () => mountToken,
  tell: (error) => { if (status) tell(athleteStateFailureCopy(error)); },
  clearDraft: () => clearSleepDraft(),
  paintTodayEntry: () => paintTodayEntry(),
});
```

Beside it and NOT part of it, because the census separates them: **two injected pure helpers**
(`reasonOf`, `sleepTyped`) and **three constructor arguments** (`doc`, `phone`, `status`). B.5 has
the full twelve-name table and H.2 STOP 8 is restated against it.

**It is `painter`, not `paint`** (R1 BLOCKING-1): `paint()` is a declared function with 14 code
occurrences in `gym-app.mjs`, and the two released files take the same name for the same thing so
the fence states one rule rather than two. Everywhere below, `painter.repaint`, `painter.token()`,
`painter.screenNow()`, `painter.tell` and `painter.clearDraft()` are read for v2's `paint.*`.

**Why this is safe when a writer the other way is not.** Every one of the five reads or writes only
the SCREEN. None of them can store, mint, open or admit anything; the worst a bad implementation can
do is paint the wrong screen or lie about the token, and `recordSleep:1921-:1926` already says in
the file's own words that "Ownership governs PAINTING and NAVIGATION ... it never governs the
record". The token is a paint concern; the file says so; it stays with the paint. That disposes of
v1's B.4 `mountToken` problem and the blind map's probe 7 at once, in the right direction: the token
stays single-valued because there is still exactly one of it, in the released half, read through
`painter.token()`.

`painter.tell` takes the ERROR, not the sentence, so the copy composer stays in the released view
where C-UI-2 can edit it, and `athleteStateFailureCopy` does not move.

**`mountToken += 1` at `:2296` stays RELEASED on purpose, and that answers the one line R1's
data-safety column names that does not move.** The reviewer lists the mount invalidation among the
decisions left in a file six tickets edit. It is not a decision about a record: `:2289-:2294`'s own
comment says leaving a screen invalidates the mount so that deferred work "finds its token stale
when it resolves and APPLIES NOTHING, so the destination the athlete chose is never repainted from
under him", and `:1921-:1926` says ownership "never governs the record". A released file that
stopped bumping the token paints over the athlete's chosen screen; it does not write a row. It
belongs with the router's cursor, and moving it would put the router's own state behind two
callbacks for no safety gained. **What sat beside it and WAS a data decision is `:2297`, and that
moves** (SEAM 10).

### B.5 Every crossing, disposed of by a row (S-R2, S-R17 (c) and (f))

v2 disposed of the crossing bindings of A.3, a HAND census. R1 found seven it had missed as
ASSIGNMENTS; R2 found an eighth by reading again. **This section is over the machine's 282, and the
rule is that a name with no disposition row here is a build-round STOP.** The full list, with the
region that declares each name, is `CROSSINGS.md`; what follows is the disposition per class, and
then every row of the class that decides what is stored.

| class | refs | disposition |
|---|---|---|
| released reads a sealed binding | 119 | a FACADE getter. Nothing else; a getter cannot write |
| released calls a sealed function | 42 | a CALLBACK TABLE entry (or a facade function, for the four pure reads B.3 names) |
| sealed reads a released binding | 29 | the PAINT HANDLE (`mountToken`, `screen`), a CONSTRUCTOR ARGUMENT (`phone`, `status`) or a CALLBACK ARGUMENT (`sleepDraft`) |
| sealed calls a released function | 34 | the PAINT HANDLE (`render`, `paint`, `paintTodayEntry`, `tell`, `clearSleepDraft`) or an INJECTED PURE HELPER (`reasonOf`, `sleepTyped`) |
| module-constant | 33 | a `require` the sealed module repeats (4 names), or a copy constant it must NOT hold (12 names, B.6) |
| **RELEASED ASSIGNS A SEALED BINDING** | **25** | a callback that TAKES the write. **Every one is a seam STOP under S-R17 (g)** |

#### The sealed-to-released direction, complete: 12 names, and that is the whole of it

This is the direction B.4 bounds, and the machine closes it. **Five released bindings the seal reads**
and **seven released functions the seal calls**, and nothing else crosses that way in either file.

| name | refs | where the seal touches it | disposition |
|---|---|---|---|
| `mountToken` | 12 | `TA-S27`, `TA-S29`, `TA-S30`, `TA-S32` | `painter.token()`. Captured ONCE per path, never called twice (H.1 risk 5) |
| `screen` | 9 | `TA-S13`, `TA-S18`, `TA-S19`, `TA-S20`, `TA-S27`, `TA-S34` | `painter.screenNow()`. **Those six regions are W4's list** (R2 NOTE-2: `rebindWorkout`, not `paintTodayEntry`) |
| `phone` | 2 | `TA-S32` `:1986`, `:2004`, both `checkInKit.mountCheckIn(doc, phone, ...)` | a CONSTRUCTOR ARGUMENT. DOM travelling INTO the seal is not a writer travelling out |
| `status` | 1 | `TA-S37` `:2528` `if (status) tell(...)` | inside `painter.tell`, which already carries the `if (status)` test |
| `sleepDraft` | 1 | `TA-S30` `:1822` `const entry = { ...sleepDraft, date };` | a CALLBACK ARGUMENT: `on.recordSleep(draftValues)` hands the members raw, exactly as B.3 says |
| `render` | 21 | eight moved regions | `painter.repaint` (D.1 W1) |
| `paint` | 2 | `GA-S03` `:154`, `GA-S04` `:167` | the gym card's `painter.repaint` (D.1 W7) |
| `paintTodayEntry` | 1 | `TA-S22` `:785` | the sixth paint-handle entry, and it is a CALL, not a `screen` read |
| `tell` | 1 | `TA-S37` `:2528` | `painter.tell(error)`; the copy composer stays released |
| `clearSleepDraft` | 4 | `TA-S29` `:1743` `:1752`, `TA-S30` `:1870` `:1919` | `painter.clearDraft()` (D.1 W3). **Four sites in TWO regions; W3 permits it in `recordSleep` only, so W3's region list gains `retrySleepRead`** |
| `reasonOf` | 2 | `TA-S23` `:1307`, `TA-S30` `:1903` | an INJECTED PURE HELPER. It is drawing-adjacent copy logic that stays released (B.6) |
| `sleepTyped` | 1 | `TA-S26` `:1386` | an INJECTED PURE HELPER, which is R2 BLOCKING-6 dissolved (B.3) |

**So the PAINT HANDLE is exactly SIX entries for Today** - `repaint`, `screenNow`, `token`, `tell`,
`clearDraft`, `paintTodayEntry` - and **two for the gym card** (`repaint`, `owns`), which is B.4's
five plus the sixth B.5 already added and NOT a seventh. Beside it and not part of it: **two injected
pure helpers** (`reasonOf`, `sleepTyped`) and **three constructor arguments** (`doc`, `phone`,
`status`). H.2 STOP 8 is restated against that measurement, and the measurement is what makes the
stop meaningful: a seventh entry now means a name the machine did not find.

#### RELEASED ASSIGNS A SEALED BINDING: all 25, in 8 regions. This is the acceptance test

Each row is a place where, after the cut, a file six tickets edit would be deciding what is stored or
what is re-read. **Each is a declared seam and each is an S-R17 (g) STOP the build round reports on.**

| region | rows | the assignments | the callback that takes them |
|---|---|---|---|
| `TA-M08` `:1539-:1542` | 8 | `sleepNightChoice`, `sleepRollover`, `sleepOpenedDay`, `sleepOpenedNight`, `sleepAck`, `sleepReadBack`, `sleepCorrecting`, `sleepErrorText` | `on.sleepNightChosen(rawDate)` (R1 BLOCKING-5, SEAM 9a) |
| `TA-M09` `:1560-:1562` | 4 | `sleepNightChoice`, `sleepRollover`, `sleepOpenedDay`, `sleepOpenedNight` | `on.keepNight()` (SEAM 9b) |
| RELEASED body | 7 | `foodSaving` `:1269` `:1272`, `sleepSaving` `:1667` `:1721`, `sleepCorrecting` `:1703` `:1710`, **`settingsSaving` `gym-app.mjs:279`** | the sealed half MINTS and assigns the two promises; `on.sleepCorrect(flag)` takes the two flags; **and the gym row is new (B.9)** |
| `TA-M10` `:2297` | 2 | `sleepCheckInDay`, `sleepCheckInPending` | `on.forgetCheckInRead()` (R1 BLOCKING-4, SEAM 10) |
| `TA-M07` `:1435` | 1 | `sleepCheckInViewPending` | **R2 BLOCKING-1.** `on.readSleepCheckInView(date)` returns the promise and the SEAL assigns the handle; the `.then` body `:1436-:1443` is pure paint and stays released, handed back as a paint closure. `:1445`'s `return sleepCheckInViewPending;` becomes `return facade.sleepCheckInViewPending();`, which also serves the router's `:2342` |
| `TA-M01` `:652` | 1 | `measureScreen` | `on.paintMeasure(root, focus)` (B.8, and the signature R2 BLOCKING-8 asks for) |
| `TA-M02` `:711` | 1 | `importScreen` | `on.paintImport(root, focus)`, **and `TA-M03` `:718-:719` moves with it**, which is R2 BLOCKING-8's real finding and removes `.reopen` from E.4's false-positive list by removing the line |
| `TA-M11` `:2333` | 1 | `ready` | the setup `done` chain assigns the sealed `ready` through `on.settleAdoption(...)` (B.3, B.7) |

**PASS is: after the cut, no released file contains an assignment to any name declared at factory
scope in its sealed partner, and `census.cjs` prints the class count as ZERO.** That is not a
hand check and not a word list; it is the same scope analysis that produced this table, run again on
the build round's output. E.5 red row 13 plants one.

#### The four rows nobody had carried, disposed of

1. **`gym-app.mjs:279` `settingsSaving = recordSettings(map, view, paintedDraft);`** assigns a
   binding B.9 moves sealed at `:125`. It is the R1 BLOCKING-5 shape in the second file and the gym
   card's only one. Disposal: `on.recordSettings(...)` mints and assigns `settingsSaving` inside the
   seal, exactly as `foodSaving` is disposed of, and the released `:279` becomes a bare call.
2. **`ready` is read by a released drawing region**, `renderMeasure:668` `try { await ready; }`. B.7
   disposes of `ready` in the api literal and nowhere else. Disposal: `facade.ready()` at `:668`,
   `lanes.api.ready` as a live accessor at `:2576`.
3. **`sleepErrorText` is read by released code at `:1657` and `:1658`**
   (`error.textContent = sleepErrorText ? plainOrDrop(sleepErrorText, "sleep-error") : ...`). B.5 v2
   turns the binding into the sealed `sleepOutcome` and never names the two reads that must become
   the mapper's input. Disposal: those two lines ARE B.6's mapper's call site, and the cell that
   proves B.6 drives them.
4. **33 module-level references cross, in 16 names**, counted nowhere in the spec: `FoodModel`,
   `SleepModel`, `plainOrDrop` and `athleteStateFailureCopy` (11 refs) are re-`require`d by the
   sealed module, and the twelve copy constants (22 refs) must NOT be, which is B.6 and S-R13.

#### The bindings that STAY released, and the file's own reason

Unchanged from v2 and re-confirmed by the census, which finds no crossing that contradicts any of
them: `sleepDraft` and `clearSleepDraft` (`:475` "The screen's own transient state. Nothing durable
lives here."); `screen` and `checkinOrigin` (the router owns them); `mountToken` and `disposed`
(`:2296`'s bump stays released under S-R15, on `:2289-:2294` and `:1921-:1926`); `todayEntry` and
`paintTodayEntry`; `phone`, `status`, `chrome`, `doc`; and in the gym card `settingsDraft`,
`settingsDraftLift`, `settingsErrors` and `refuse()`'s DOM half (B.9).

### B.6 The writer returns an OUTCOME; the view owns every word (S-R2, S-R13)

This is the change that frees C-UI-7, and under S-R13 it becomes a LAW rather than a convention: the
fence asserts **ZERO athlete-facing string literals in the sealed lane modules**, which replaces
D.3's nine optional widenings.

**THE MEASUREMENT v2 DID NOT HAVE.** B.6 v2 tabled `recordSleep`'s eleven sentences and nothing else.
The machine counts the copy constants the SEALED half would close over if nothing were done:

| | measured |
|---|---|
| distinct released copy constants the sealed half reads | **12** |
| references to them | **22** |
| moved regions they sit in | **3**: `TA-S23` `recordIntake`, `TA-S29` `retrySleepRead`, `TA-S30` `recordSleep` |

| constant | refs | where |
|---|---|---|
| `SLEEP_NOTHING_RECORDED` | 5 | `:1742`, `:1819`, `:1825`, `:1889`, `:1904` |
| `SLEEP_NOT_SAVED` | 4 | `:1742`, `:1825`, `:1887`, `:1903` |
| `FOOD_REFUSED` | 2 | `:1283`, `:1307` |
| `SLEEP_KEPT` | 2 | `:1742`, `:1889` |
| `SLEEP_UNCERTAIN` | 2 | `:1851`, `:1880` |
| `FOOD_REFUSAL_COPY`, `FOOD_REFUSED_ACTION`, `FOOD_REASON`, `SLEEP_ROLLOVER`, `SLEEP_REFUSAL_COPY`, `SLEEP_NIGHT_CHANGED`, `SLEEP_CHECKIN_CHANGED` | 1 each | `:1283`, `:1307`, `:1888`, `:1819`, `:1825`, `:1901`, `:1902` |

**`retrySleepRead` composes athlete-facing copy at `:1742` and B.6 v2 does not carry it.** That is
the spike's finding 7 and it is why the eleven-row table below is necessary but not sufficient: the
outcome discipline has to cover `TA-S29` as well as `TA-S30`, and `TA-S23`'s two food sentences as
well (which SEAM 2 half-carries). **The build round's target is 22 references to zero.**

The eleven-row mapping of `recordSleep`'s sentences is KEPT unchanged from v2, including R1 N2's
correction, and it remains specified **against the source line, character for character**: the build
round copies each expression out of `:1815` to `:1904` verbatim into the view's mapper with only
`result` replaced by the outcome's own fields.

| # | today | line | outcome after the cut | the view's mapping |
|---|---|---|---|---|
| 1 | `sleepErrorText = ""` | `:1815` | `null` | nothing is drawn |
| 2 | `SLEEP_ROLLOVER + " " + SLEEP_NOTHING_RECORDED` | `:1819` | `{ kind: "rollover" }` | the same two constants, joined the same way |
| 3 | `(SLEEP_REFUSAL_COPY[refusal] \|\| SLEEP_NOT_SAVED) + " " + SLEEP_NOTHING_RECORDED` | `:1825` | `{ kind: "refused", refusal }` | the same lookup, in the view |
| 4 | `sleepErrorText = SLEEP_UNCERTAIN` | `:1851` | `{ kind: "uncertain" }` | `SLEEP_UNCERTAIN` |
| 5 | `say("")` after a landed reconciliation | `:1872` | `null` | nothing |
| 6 | `say(SLEEP_UNCERTAIN)` after a failed read | `:1880` | `{ kind: "uncertain" }` | as 4 |
| 7 | `SLEEP_NOT_SAVED + FOOD_REASON + code + ". " + SLEEP_NOTHING_RECORDED + " " + SLEEP_KEPT` | `:1887-:1889` | `{ kind: "not-saved", code }` | the same five parts in the same order |
| 8 | `SLEEP_NIGHT_CHANGED` | `:1901` | `{ kind: "late-refusal", code: "SLEEP_STALE_NIGHT" }` | the same branch on `code` |
| 9 | `SLEEP_CHECKIN_CHANGED` | `:1902` | `{ kind: "late-refusal", code }` with `code.indexOf("SLEEP_SOURCE_") === 0` | the same test |
| 10 | `[SLEEP_NOT_SAVED, reasonOf(result)].filter(Boolean).join(" ")` | `:1903` | `{ kind: "late-refusal", code, copy }` carrying `result.copy` verbatim | `reasonOf` stays released at `:1339` and is INJECTED back into the seal for `:1307` (B.5); **`.filter(Boolean)` is part of the mapper** |
| 11 | `+ " " + SLEEP_NOTHING_RECORDED` on 8, 9 and 10 | `:1904` | in `kind` | one constant, appended once |

**And the twelfth row, which is new:** `retrySleepRead:1742` composes `SLEEP_NOT_SAVED`,
`SLEEP_NOTHING_RECORDED` and `SLEEP_KEPT` on the retry path. It gets the same treatment,
`{ kind: "retry-failed" }`, mapped in the view from the same three constants in the same order.

**THE MAPPER'S CALL SITE IS `:1657-:1658`**, which B.5 v2 never named:
`error.textContent = sleepErrorText ? plainOrDrop(sleepErrorText, "sleep-error") : (sleepReadBack ? ... : "")`
becomes the mapper over `facade.sleepOutcome()`, with the `sleepReadBack` arm unchanged. The cell
drives the empty-reason case by name: a late refusal carrying neither `code` nor `copy` must paint
exactly `SLEEP_NOT_SAVED + " " + SLEEP_NOTHING_RECORDED` with ONE space, and a red-first run with
the filter dropped must fail on the double space.

The outcome type is a closed set of **eight** shapes - `null`, `rollover`, `refused`,
`refused-before-write`, `uncertain`, `not-saved`, `late-refusal`, `retry-failed` - plus `in-flight`
from B.3's sealed duplicate guard, which the view maps to NOTHING DRAWN. Frozen in the sealed module
and asserted EXHAUSTIVE by a red-first cell: an outcome the view cannot map must FAIL, never fall
through to a blank slot.

**What this buys, unchanged and now fenced.** `VIEW_SOURCES` (`design.cjs:607`) does not change, so
`design.test.cjs:79-:81` needs no edit. `NOT_AVAILABLE` stays at `today-app.cjs:38`, so
`copy.test.mjs:406`'s planted-dash cell keeps its teeth over the file that still owns every
athlete-facing string. `assertDesignBinding` keeps binding every declared copy line to the same
concatenation. **And under S-R13 the fence asserts the result rather than trusting it**: zero
literals of more than three words, outside a module specifier, an error code and a comment, in
`today-lanes.cjs`, `gym-settings-lane.mjs` and `today-readings.cjs`, measured by the same literal
regex `food.test.mjs:899` uses. D.4's copy multiset stays as the second proof.

**One measured qualification.** `today-readings.cjs` takes `TM-S01`'s four refusal constants
(`ALREADY_RECORDED`, `FORM_MIN`, `FORM_MAX`, `OUT_OF_RANGE`), and two of those four ARE athlete-facing
sentences. So the zero-copy assertion is over `today-lanes.cjs` and `gym-settings-lane.mjs`, and
`today-readings.cjs` is declared as carrying exactly four constants, listed by name in the cell, with
a red row for a fifth. That is a smaller box, stated rather than glossed, and it is the one place
where F.1's cut and S-R13 pull against each other. **It is also the one copy move in the whole split
that has been RUN: the wired `today-model.cjs` / `today-readings.cjs` pair, with those four
constants in the sibling, takes the whole today step to 682 of 682 (F.1), so no cell in the step
depends on their file of residence.** D.4's prediction changes accordingly and must be stated before
the build round meets it: the expected delta is EMPTY for `today-lanes.cjs` and
`gym-settings-lane.mjs` and is exactly those four literals for `today-readings.cjs`, with the
multiset over all five files equal.

### B.7 The export surface, and the TWO returned apis (S-R3, and R2 BLOCKING-4)

**`module.exports` (`:2600-:2625`, R2 NOTE-10 (a)) is unchanged, name for name.** `today-entry.mjs`
is pinned on disk by sha256 (`local-today-journey.test.mjs` `PAGE_PINS`, `DECISIONS:144`), `:44`
reads `const { mountToday, createTodayModel } = app;` off it, and eleven sealed cells import the same
surface. Nothing may move on it.

**THE RE-EXPORT RULE BELONGS TO F.1's FALLBACK ONLY, and R2 NOTE-7 is right.** Under F.1 as
recommended, `today-model.cjs` stays FREE and RELEASED, E.3's "what a released view MAY import" list
already names it, and `today-app.cjs:16`'s `const { createTodayModel } = require("./today-model.cjs")`
stays exactly as it is. The detour through the sealed module, and E.5 row 7 with it, exist only under
F.1 (d). The RE-EXPORT RULE itself stays in E.3, because `createTodayLanes` and
`createGymSettingsLane` still need it.

**The returned api, `TA-M14` `:2552-:2595`, written out as an explicit literal.** A spread INVOKES an
accessor and copies its value, so `{ ...lanes.api() }` turns `get ready()` back into the snapshot
P0-C was written to remove; it also reorders the keys; and v2's two lists between them named
nineteen of the twenty. `Object.freeze` is a fourth change v2 claimed it was not making: `:2552`
returns a plain extensible object today.

```
return { render, read: () => facade.read(), openWeighIn, screen: () => screen,
  importScreen: () => lanes.api.importScreen(), importAdmitted: () => facade.importAdmitted(),
  foodPending: () => lanes.api.foodPending(), foodReady: () => lanes.api.foodReady(),
  sleepPending: () => lanes.api.sleepPending(), sleepReady: () => lanes.api.sleepReady(),
  sleepCheckInReady: () => screen === "sleep-checkin"
    ? lanes.api.sleepCheckInViewPending() : lanes.api.sleepCheckInPending(),
  checkInKitReady: () => lanes.api.checkInKitReady(), sleepLane: () => lanes.api.sleepLane(),
  sleepAck: () => lanes.api.sleepAck(), sleepMount: () => mountToken,
  workoutEntry: () => lanes.api.workoutEntry(), workoutRebound: () => lanes.api.workoutRebound(),
  get ready() { return lanes.api.ready; },
  dispose() { ... },                     // unchanged
  disposed: () => disposed };
```

**R2 BLOCKING-4 (a) is FIXED and the census is what proves it was broken.** `CROSSINGS.md` carries
`importScreen read today-app.cjs:2556, sits in TA-M14, declared in TA-S20 at :688` - a released file
closing over a binding the cut moves sealed. The literal above is corrected to
`lanes.api.importScreen()`, as its eleven neighbours are.

**R2 BLOCKING-4 (b) is FIXED.** `workout read :2568` and `workoutRebinding read :2569`, both in
`TA-M14`, both declared sealed in `TA-S01`. `workoutEntry: () => lanes.api.workoutEntry()` hands its
CALLER the injected workout entry, which carries `.recover()`, `.open()`, `.summary()` and
`workout.gym.holdForAdoption()`. That is the same pass-through class as `sleepLane`, stated rather
than denied, and **E.5 red row 14 covers both**: a released file that CALLS a method on the result of
`lanes.api.sleepLane()` or `lanes.api.workoutEntry()` FAILS `FENCE-WRITER-NAME`.

**R2 BLOCKING-4 (c) is FIXED in B.1.** B.1 point 4 now reads: the factory hands the view a frozen
READ-ONLY FACADE, a frozen CALLBACK TABLE, **and `lanes.api`, a third object that exists only to
serve the mount surface `today-entry.mjs` pins, two of whose entries return writer-capable objects by
reference and are fenced by name**. S-R2's "two frozen things and nothing else" is qualified where
the ruling is carried out, not only where the exception is measured.

#### THE SECOND API, which no round has carried: `gym-app.mjs:569-:579`

```
569:  first.settings = Object.freeze({
570:    pending: () => settingsSaving,
571:    ready: () => settingsOpening,
572:    lane: () => settingsLane,
576:    read: () => settingsReading,
577:    stateFor: (liftId) => (settingsRead.has(liftId) ? settingsRead.get(liftId).state : 'reading'),
579:    owns: () => owns,
```

Five of those six thunks close over bindings B.9 moves SEALED (`settingsSaving` `:125`,
`settingsOpening` `:124`, `settingsLane` `:123`, `settingsReading` `:140`, `settingsRead` `:138`);
only `owns` is released. **`lane: () => settingsLane` is a third pass-through of a writer-capable
object**, in a file B.9 discusses at length without ever mentioning that it has an api. The
disposal is B.7's, applied twice: each of the five becomes `gymLanes.api.<name>()`, the object stays
extensible and in its own key order, and **E.5 red row 14 gains `gymLanes.api.lane()`** as a third
planted case. The gym card's mount surface gets the same before-and-after key-order proof the Today
api gets.

**THE PROOF OF BOTH SURFACES, and it is a STOP.** A cell captures `Object.keys(api)` and
`Object.getOwnPropertyDescriptor(api, "ready")` before and after the split and asserts the key list
is EQUAL AND IN ORDER and that `ready` is an accessor both times; it drives the in-page transition
off "Start using Earned" and asserts the property returns the SECOND settle; and the same cell does
`Object.keys(first.settings)` for the gym card. H.2 stop 7 covers `module.exports`; 7b covers these
two.

**The cost of the facade, re-measured and now bounded by the census.** v2's "59 lines that name
`model.`" was a raw grep. The real census of `model.` as an OBJECT is about 30 code lines, of which
about 15 stay released, every one a READ and every one rewritten `model.` to `facade.`. Those 15 are
the one part of the interface scope analysis cannot see (B.3's instrument note), and the build round
closes that gap by re-running `census.cjs` after the rewrite, when they have become bare `facade`
members.

### B.8 The seams, line by line (S-R2, and reconciled with the machine's list)

**THE SEAM LIST IS THE MACHINE'S (S-R17 (g)), and this section is its line-by-line reading.** The
authoritative list is `regions.json`: 20 declared seam regions today, 25 after B.3's five boot seams.
The ten traces below are kept because two independent reviewers checked several of them line for
line and they are the substance a trace-asserting cell is written from; what has changed is that a
seam's RANGE is no longer read out of this prose.

| this section's name | region | tip lines | notes |
|---|---|---|---|
| SEAM 1, the weigh-in submit's write half | `TA-M05` | `:1071-:1073` | aligned. R2 verified it line for line |
| SEAM 2, `recordIntake`'s wiring | `TA-S23` + the released `:1269`, `:1272` | `:1278-:1319` moves whole | R2 NOTE-3 is settled below |
| SEAM 3, `recordSleep` | `TA-S30` | `:1807-:1930` moves whole | R2 BLOCKING-6's `:1813` needs no rewrite (B.3) |
| SEAM 4, `workout.recover()` | `TA-M04` | `:954` | aligned |
| SEAM 5, the router's setup branch | `TA-M11` | `:2300-:2336` | **STRADDLES**: the block runs `:2300-:2337` |
| SEAM 6, the recovery branch | `TA-M12` | `:2349-:2351` | **range corrected** (R2 BLOCKING-5): the branch is `:2343-:2354`, and `:2355`/`:2356` are the measure and import routes, which do NOT move |
| SEAM 7, the workout branch | `TA-M13` | `:2364-:2365` | **range corrected**: the branch is `:2359-:2374` and the two `renderStub` fallbacks at `:2372-:2373` stay |
| SEAM 8, `sleepCheckInFor`'s entry read | `TA-M06` | `:1406-:1407` | aligned |
| SEAM 9a / 9b, the two sleep date handlers | `TA-M08`, `TA-M09` | `:1539-:1542`, `:1560-:1562` | aligned. Twelve of the 25 assignment rows are here |
| SEAM 10, the mount-invalidation block | `TA-M10` | `:2297` | aligned. `:2296`'s `mountToken += 1` stays released (S-R15) |
| SEAM 11, `renderSleepCheckIn`'s read handle | `TA-M07` | `:1435` | **STRADDLES**: the statement runs `:1435-:1444`. R2 BLOCKING-1 |
| **NEW**, `renderImport` drives the sealed screen | `TA-M03` | `:718-:719` | R2 BLOCKING-8's third row: it MOVES with the import, which removes `.reopen` from E.4's false-positive list |
| **NEW**, the two paint seams | `TA-M01`, `TA-M02` | `:650-:652`, `:709-:711` | `on.paintMeasure(root, focus)` and `on.paintImport(root, focus)`. R2 is right that `on.paintX(root)` cannot carry `:710`'s mount token or `:718`'s `focus`, so both signatures take `focus` and the token comes from `painter.token()` inside the seal |
| **NEW**, the api literal | `TA-M14` | `:2552-:2595` | B.7 |
| SEAM G1 and the five gym call sites | `GA-M01` to `GA-M06` | B.9 | `GA-M02` **STRADDLES**: the statement runs `:419-:420` |
| **NEW**, the five boot seams | B.3 | `:422`, `:482`, `:567`, `:2440-:2441`, `:2550` | the region table's five `kind` changes |

**R2 NOTE-3, settled.** SEAM 2's throw-path trace and SEAM 2's placement disagreed about whether the
button is re-enabled before or after the repaint. **Today's order is the asserted order**: `:1295`
`readBack` set, `:1297` `save.disabled = false`, `:1298` `render(...)`, so the trace is
`[check, disable, check-sealed, save-throws, readBack-set, enable, repaint]` and the `render(...)`
call comes OUT of the moved region into the view's "after" half. `:1301`'s `finally` already
re-enables after the render today, so the end state was never in doubt; the trace the cell asserts
now matches the file.

**SEAM 1 - the weigh-in submit, `today-app.cjs:1059-:1082`.**

| line | today | after |
|---|---|---|
| `:1059-:1060` | `sheet.addEventListener("submit", async (event) => { event.preventDefault();` | PAINT, unchanged, but installed through `on.listen(sheet, "submit", fn)` (E.6) |
| `:1061-:1067` | the seven-line comment on the two refusals and the disabled button | PAINT. It describes what the view does and stays with the view; the two sentences about the client's own words are re-said in the sealed half's own comment |
| `:1068-:1069` | `if (submit.disabled) return; submit.disabled = true;` | PAINT, unchanged, in this order, **and a SEALED `weighInBusy` flag is added behind it** (B.3): after the cut the DOM flag is the only thing between two gestures and two writes, and it lives in a released file six tickets edit |
| `:1070` | `const raw = input.value.trim();` | **MOVES.** The trim is parsing. The view passes `input.value` untrimmed |
| `:1071-:1073` | `let result; try { result = await model.weighIn(raw === "" ? raw : Number(raw)); } catch (error_) { result = { ok: false, copy: "This weight could not be recorded, and nothing was recorded. " + ... }; }` | **MOVES whole**, byte-identical inside `on.submitWeighIn(rawText)`, which returns `{ ok, copy }`. `Number(raw)` is the conversion S-R2 names |
| `:1074` | `submit.disabled = false;` | PAINT, unchanged, immediately after the await returns |
| `:1075-:1078` | `if (!result.ok) { error.textContent = plainOrDrop(result.copy \|\| "...", "weigh-error"); input.focus(); return; }` | PAINT, unchanged, including the fallback string and the slot name `"weigh-error"`. **This is v1's residue R1, and it ceases to be a residue: C-UI-3 may move the sentence, change the node and flag the field freely** |
| `:1080-:1081` | `close(); render("today", true);` | PAINT, unchanged |

Order before: disable, convert, write, enable, paint-or-close. Order after: disable, call (which
converts and writes), enable, paint-or-close. **Identical, and the one line that moved is the line
that converts.**

*The cell that proves it.* A red-first cell drives the sheet with `" 181.4 "`, `""`, `"abc"`,
`"10000"` and a value the reading lane refuses, and asserts, for each: the exact sentence in
`#weigh-error`, that `submit.disabled` was true for the whole of the await and false after, that
the sheet is still open on a refusal and closed on a success, and that the reading lane holds
exactly zero operations after every refusal and exactly one after the success. `view.test.mjs`
already drives most of this; the new cell adds the untrimmed and the thrown cases.

**SEAM 2 - `recordIntake`, `today-app.cjs:1278-:1319`, and its wiring at `:1269` and `:1272`.**

| line | today | after |
|---|---|---|
| `:1269` | `retry.addEventListener("click", () => { foodSaving = retryFoodRead(); });` | PAINT calls `on.retryFoodRead()`; the SEALED half assigns `foodSaving`. The view assigns nothing |
| `:1272` | `save.addEventListener("click", () => { foodSaving = recordIntake(save, cal, pro, error); });` | PAINT: `on.listen(save, "click", async () => { ... })`, the handler below |
| `:1280-:1281` | `const entry = { cal: cal.value, pro: pro.value }; const refusal = FoodModel.refusalFor(entry);` | **MOVES**, into `on.foodCheck(cal.value, pro.value)`, and is re-run inside `on.recordIntake` as defence in depth (see below) |
| `:1282-:1285` | `if (refusal) { error.textContent = plainOrDrop(FOOD_REFUSAL_COPY[refusal] \|\| FOOD_REFUSED, "food-error"); return; }` | PAINT, unchanged, driven by `on.foodCheck`'s `{ refusal }`. **v1's residue R2 ceases to be a residue** |
| `:1286` | `const dayValues = FoodModel.dayFromEntry(entry);` | **MOVES** |
| `:1287` | `save.disabled = true;` | PAINT, and it now runs in the view between the check and the call, which is the same point in the sequence it runs at today. **A SEALED `foodBusy` flag is added behind it** (B.3), for the reason SEAM 1's `:1068-:1069` row gives |
| `:1288-:1301` | `let result = null; try { result = await foodLane.save(dayValues); } catch (thrown) { foodReadBack = {...}; save.disabled = false; render("nutrition", false); return; } finally { save.disabled = false; }` | **MOVES**, with `save.disabled = false` deleted from the catch and the finally (the view does it) and `render(...)` becoming `painter.repaint("nutrition", false)`. Returns `{ kind: "unknown" }` |
| `:1302-:1309` | `if (!result \|\| result.ok !== true) { error.textContent = plainOrDrop(FOOD_REFUSED + " " + reasonOf(result) + " " + FOOD_REFUSED_ACTION, "food-error"); return; }` | SPLIT: the sealed half returns `{ kind: "refused", code: result && result.code, copy: result && result.copy }`; the PAINT, the three constants and `reasonOf` stay in the view. **v1's residue R3 ceases to be a residue** |
| `:1310-:1317` | the `foodReadBack` assignment and `render("nutrition", false)` | **MOVES**; the repaint becomes `painter.repaint` |
| after | - | PAINT: `save.disabled = false;` then the outcome mapping |

**Defence in depth, and it is a strengthening, not a weakening.** `on.recordIntake` re-runs
`FoodModel.refusalFor` on the raw values it was handed and, if it refuses, returns
`{ kind: "refused-before-write" }` having opened nothing and stored nothing. So a released view
that skipped `on.foodCheck` - by accident or by a future edit - still cannot put an inadmissible
entry into the store. Today nothing stops it, because the check and the write are the same
function; after the split the check is inside the seal twice.
*The cell that proves it, with N3's contradiction resolved.* R1 N3 is right: SEAM 2 asks
`on.recordIntake` to re-run `FoodModel.refusalFor` and then asserts a trace with ONE `check` in it.
There are two checks after the cut and the trace names both. The order of writes and paints is
asserted as a SEQUENCE, not as an end state: a recording cell wraps `FoodModel.refusalFor`,
`foodLane.save`, `save.disabled`'s setter and `render`, and asserts the trace is, for a refusal the
view catches, `[check, paint-error]` with no second check and no `save` at all; for an acknowledged
write, `[check, disable, check-sealed, save, enable, repaint]`; for a throw, `[check, disable,
check-sealed, save-throws, readBack-set, enable, repaint]`; and for the defence-in-depth case - the
view's own check skipped, as a future edit might - `[disable, check-sealed, enable]` with NO `save`
and the outcome `refused-before-write`. `food.test.mjs` already drives the first three states over
the real lane; this adds the trace and the fourth state.

**SEAM 3 - `recordSleep`, `today-app.cjs:1807-:1930`.**

The whole of it moves. It touches no DOM node at all today (v1 found this and it is correct at
`c15a69c0`), so the seam is not DOM at all: it is the eleven sentences of B.6 and the five things it
reaches outside itself.

| what | line | after |
|---|---|---|
| `if (sleepBusy \|\| sleepUnknown \|\| sleepReadBack) return;` | `:1808` | MOVES, unchanged; all three are sealed state |
| `const say = (s) => { sleepErrorText = s; render("sleep", false); };` | `:1812` | becomes `const say = (o) => { sleepOutcome = o; painter.repaint("sleep", false); };`. One line, and the comment above it at `:1809-:1811` is kept verbatim because it is still exactly true |
| `sleepClockCheck(); const date = sleepNightDate();` | `:1813-:1814` | MOVES with them (B.2 rows 20 and 21). **Both are now pure sealed reads of sealed state**, because `sleepNightChoice` moves with them (R1 BLOCKING-6): `on.recordSleep` takes the draft values only and the night is NOT passed in |
| `const entry = { ...sleepDraft, date };` | `:1822` | becomes `const entry = { ...draftValues, date }` where `draftValues` is the raw object the callback received |
| the eleven `say` sites | B.6 | outcomes |
| `const token = mountToken;` and its six comparisons | `:1839` and B.4 | `painter.token()` |
| `clearSleepDraft()` | `:1870`, `:1919` | `painter.clearDraft()` |
| `workoutRebinding = rebindWorkout();` | `:1871`, `:1927` | unchanged; both are sealed |
| `SleepModel.rowFor(night, model.engine).h` | `:1912` | unchanged; `model` is sealed-side |

**The order does not change anywhere.** Every statement keeps its position; the only substitutions
are `sleepErrorText = <sentence>` to `sleepOutcome = <outcome>`, `render` to `painter.repaint`,
`mountToken` to `painter.token()` and `clearSleepDraft()` to `painter.clearDraft()`. D.1 defines
those four substitutions as the exact wrapper and proves nothing else moved.

*The cell that proves it.* The reconciliation path is the one that matters and `problem.test.mjs`
already drives it: a save that throws, a refresh that answers, a night that landed, a navigation
mid-flight. The new cell asserts the trace `[save-throws, outcome=uncertain, repaint, refresh,
landed, clearDraft, rebindWorkout, outcome=null, repaint]` in that order, and that a navigation
between the throw and the refresh produces the same DURABLE result and NO repaint. That is
`recordSleep:1921-:1926`'s own contract, said as a test.

**SEAM 4 - `workout.recover()` in the primary handler, `:949-:960`.** `primary.disabled = true;`
stays; `await workout.recover()` becomes `await on.recoverWorkout()`; the `finally` and the
`render("today", false)` stay. One identifier. The cell asserts the button is disabled for the whole
await and that a failed recover still re-enables it.

**SEAM 5 - the router's setup branch, `:2300-:2336` (v2 wrote `:2295-:2336`; R1 BLOCKING-4's range
correction is right, and `:2295-:2299` is SEAM 10's business, not this one).** The released router keeps
`if (next === "setup" && !firstRun()) next = "today";` at `:2287` (a READ through the facade) and
`if (next === "setup") return on.openSetup({ back: () => render("today", true) });`. The whole
`done` closure `:2317-:2333` - `canAdoptAthleteState`, `armAdoptionGate`, `ready = settleAdoption
(...)`, `render("today", true)`, `return ready` - moves into the sealed half byte-identical except
its last `render` call, which becomes `painter.repaint("today", true)`. The two long comment blocks
INSIDE the branch (between `:2300` and `:2316`, and `:2321-:2332`) move with it: they explain the
adoption chain, not the route. v2 gave the first of them as `:2298-:2316`, which straddles the
mount-invalidation block; the build round takes the boundary from the branch's own braces, not from
this line number.

This is the seam that answers S-R8's "the boot or the router carrying a data decision that must not
be released". **The router carries THREE data decisions, not v2's two** (R1 BLOCKING-4): `firstRun()`
at `:2287`, which is a READ and stays as a facade call; the `done` chain, which moves here; and the
check-in cache invalidation at `:2297`, which moves in SEAM 10. Nothing else in `render` `:2272-:2380`
touches
a store, and `food.test.mjs:696-:698`'s slice from `if (next === "setup"` to `if (next === "why")`
still contains `firstRun()` afterwards, so that cell is unaffected.

**SEAMS 6 and 7 - the recovery and workout branches, `:2349-:2356` and `:2362-:2369`.** The branch
structure, the `checkinOrigin` bookkeeping at `:2350-:2352` and the two fallbacks
(`renderCheckInWithoutStore`, `renderStub("t-workout", ...)`) stay in the released router, because
they are drawing decisions about a device with no store. `reboundCheckIn(origin)` and the two
`open({ doc, phone, back, ... })` calls move into `on.openCheckIn` and `on.openWorkout`, which
return whatever the entry returns or `null`; the router then falls through to its own fallback on
`null`, exactly as it does today at `:2354` and `:2371`.

**SEAM 8 - `sleepCheckInFor`, `:1402-:1409` (R1 BLOCKING-7's second half).** The function is a
released drawing helper (it is in no B.2 whole-move row and C-UI-7 paints from it), and two of its
eight lines reach the INJECTED CHECK-IN ENTRY, which B.5 says never crosses:

| line | today | after |
|---|---|---|
| `:1403-:1405` | `const day = SleepModel.dayAfter(date);` and the two cache tests | PAINT, unchanged; the two tests become `facade.checkInDay()`, `facade.checkInPending()`, `facade.checkInFailed()`, `facade.checkInRow()` |
| `:1406` | `const active = checkInLive \|\| (checkin && checkin.checkin);` | **MOVES.** The entry is sealed |
| `:1407` | `const row = active && typeof active.recorded === "function" ? active.recorded() : null;` | **MOVES**, behind `facade.checkInRecordedRow()`, which returns a CLONE and never the entry |
| `:1408` | `return row && row.date === day ? row : null;` | PAINT, unchanged, over the clone |

`recorded()` is a read; it opens nothing and writes nothing, so the facade may serve it. The clone
matters for the same reason `sleepAck` is cloned: a row the view can mutate is a row the seal's next
read disagrees with. *The cell*: drive a device whose check-in entry holds a row for the morning
after, assert the same sentence is painted as today, and assert that mutating the returned row does
not change what the next call returns.

**SEAM 9 - the sleep date control and the keep-night control, `:1535-:1565` (R1 BLOCKING-5).** Two
released handlers assign SEVEN sealed bindings between them, and two of those assignments are not
bookkeeping.

| line | today | after |
|---|---|---|
| `:1536-:1538` | `dateBox.disabled = ...; const latest = SleepModel.nightDateFor(sleepToday()); if (latest) dateBox.max = latest;` | PAINT, unchanged; `sleepToday()` is a facade read |
| `:1539-:1542` | the change handler's eight assignments | **MOVE whole**, in their order, into `on.sleepNightChosen(dateBox.value)` (B.3). `sleepErrorText = ""` becomes `sleepOutcome = null` per B.6 |
| `:1543` | `render("sleep", false);` | PAINT, unchanged, after the callback returns |
| `:1549` | `const rolled = sleepClockCheck();` | becomes `const rolled = on.sleepClock(sleepTyped()).rollover;`. **v2 marked `on.sleepClock` "writes? no" and that was half true**: it stores nothing and it MUTATES the rollover guard. It is declared ENTRY and guard-mutating in B.3 |
| `:1550-:1558` | the two rollover sentences and their `hidden` flags | PAINT, unchanged |
| `:1560-:1562` | the keep-night handler's four assignments | **MOVE whole** into `on.keepNight()` |
| `:1563` | `render("sleep", false);` | PAINT, unchanged |

**Why these two are the sharpest lines in R1.** `sleepRollover = null` at `:1540` and `:1561` clears
the guard the DURABLE write refuses on: `recordSleep:1818` is
`if (sleepRollover) { say(SLEEP_ROLLOVER + ...); return; }`, and `:1816-:1817` says why in the file's
own words - "a rollover that has not been answered blocks the write. The athlete confirms which
night this is for; the page never decides for him." And `sleepAck = null; sleepReadBack = null` at
`:1542` drops the acknowledgment of a write that landed, which `:437-:441` keeps on purpose: "A save
that the client acknowledged is durable whatever the read-back afterwards does, so the figure it
carries stays on the screen instead of vanishing with the draft." Left in a released file, both are
decisions about the record taken by the view. Moved, they are two callbacks the fence can name.
*The cell*: with a draft typed and the clock rolled over, assert the save REFUSES; then drive the
keep-night control and assert it saves against the night the athlete confirmed; then drive the date
control after an acknowledged save and assert the acknowledgment is cleared in the SEAL and nowhere
else, with the store holding exactly what it held before.

**SEAM 10 - the mount-invalidation block, `:2295-:2299` (R1 BLOCKING-4).**

| line | today | after |
|---|---|---|
| `:2295` | `if (next !== screen) {` | PAINT, unchanged |
| `:2296` | `mountToken += 1;` | PAINT, unchanged, RELEASED, with B.4's reason |
| `:2297` | `if (next === "sleep") { sleepCheckInDay = null; sleepCheckInPending = null; }` | **MOVES** behind `if (next === "sleep") on.forgetCheckInRead();` |
| `:2298-:2299` | `}` and `screen = next;` | PAINT, unchanged |

It is one line and it is a data decision, which is why it is a seam and not a footnote:
`readSleepCheckIn:1413` is `if (sleepCheckInDay === day && !force) return sleepCheckInPending;`, so
nulling the cache at `:2297` is exactly what makes navigating to the sleep screen start a FRESH
durable read of the check-in store. *The cell*: navigate away from and back to the sleep screen and
assert the check-in host is read again; then plant a released router that omits the call and assert
the stale row is painted, so the cell has teeth.

### B.9 The second extraction: `gym-app.mjs`, measured (S-R4, S-R11, S-R12)

**The table is `regions.json`'s `gym-app.mjs` block: four move regions and six seams.**

| region | tip lines | lines | what |
|---|---|---|---|
| `GA-S01` | `:123-:125` | 3 | `settingsLane`, `settingsOpening`, `settingsSaving` |
| `GA-S02` | `:131-:140` | 10 | the seven-line read-cache comment, `settingsRead`, `settingsInFlight`, `settingsReading` |
| `GA-S03` | `:142-:156` | 15 | `startSettingsRead` (`:147` is `settingsLane.latest(liftId)`, a LANE CALL the look map omits) |
| `GA-S04` | `:158-:170` | 13 | `openSettingsLane` (`:161` `indexedDB`, `:162` `crypto`, `:165` the dynamic import, `:166` `createMachineSettingsHost`) |
| **total moved** | | **41** | |
| `GA-M01` | `:286-:318` | seam | SEAM G1, `recordSettings` |
| `GA-M02` | `:419` | seam | `model.logSet`, **and the ALIGNMENT CHECK says the statement runs `:419-:420`** |
| `GA-M03` `GA-M04` `GA-M05` | `:444`, `:498`, `:505` | seam | `model.finish`, `model.forget`, `model.undo` |
| `GA-M06` | `:546` | seam | `model.start()`, **the one durable PUT a paint root reaches** |

**41 reconciles with v2's 67 exactly**: 41 lines move whole, and the other 26 are the part of
`recordSettings` v2 counted as moving, which is now the seam `GA-M01` and moves nothing until the
build round writes the callback. `:126`, `:127` and `:130` (`settingsDraft`, `settingsDraftLift`,
`settingsErrors`) fall between `GA-S01` and `GA-S02` and stay RELEASED, which is R1 BLOCKING-8's
correction carried in the table rather than in a sentence. R2 NOTE-10 (c): `refuse()`'s DOM half is
`:293-:294`; `:292` is a comment.

**Why the draft and its error map stay released** is unchanged and the census agrees: no crossing
names `settingsDraft`, `settingsDraftLift` or `settingsErrors` in either direction. `today-app.cjs:475`
states the rule for both files ("The screen's own transient state. Nothing durable lives here."), and
`settingsErrors` is a WeakMap keyed by the draft the view mints at `:262`.

#### The row B.9 never had: `gym-app.mjs:279`

```
279:      settingsSaving = recordSettings(map, view, paintedDraft);
```

`settingsSaving` is declared at `:125` and `GA-S01` moves it SEALED. `:279` is inside a released
control handler. **That is a RELEASED ASSIGNS A SEALED BINDING row - the exact shape of R1
BLOCKING-5, in the second file, and the gym card's only one.** Two rounds of hand census over
`today-app.cjs` never looked at `gym-app.mjs` for the same defect. Disposal: `on.recordSettings(...)`
mints and assigns `settingsSaving` inside the seal and `:279` becomes a bare call, exactly as
`foodSaving` is disposed of at `:1269`.

The other four gym crossings the census finds are ordinary and were already disposed of:
`settingsLane` read at `:246`, `:305`, `:572`; `settingsRead` read at `:251`, `:252`, `:316`, `:576`;
`settingsOpening` `:571`; `settingsReading` `:575`; `openSettingsLane` called at `:246`;
`startSettingsRead` called at `:251` and `:317`; and the two `paint()` calls the seal makes at `:154`
and `:167`, which are the gym `painter.repaint`.

#### `gym-app.mjs:546` `model.start()` in `paint()`: named, not fixed (R2 BLOCKING-3, S-R12)

```
535:  async function paint() {
539:    if (!owns) return null;
540:    const view = await model.read();
545:    if (view.phase === 'ready') {
546:      const started = await model.start();
```

`REACH.md`, at both refs: `gym-app.mjs:546 model.start() in paint [paint SYNC, boot SYNC, listener
SYNC]`. **It is the only durable PUT any paint root reaches in the three files.** Every other PUT
call site - `workout.recover():954`, `model.weighIn():1072`, `foodLane.save():1293`,
`sleepLane.save():1843`, `settingsLane.save():305`, `model.logSet():419`, `model.finish():444`,
`model.forget():498`, `model.undo():505` - is reached from a LISTENER and from nothing else.

Under S-R12 the disposition is fixed and this spec takes it without arguing:

1. **It is a PRE-EXISTING FACT of the page, not a defect the split introduces.** `paint()` writes a
   durable start today, on the first paint of a card whose phase is `ready`, with no gesture on the
   stack. The split does not change that and must not.
2. **`:546` is left BYTE-IDENTICAL.** `GA-M06` is a seam: the call moves behind `on.start()` and the
   released `paint()` calls it at the same statement.
3. **`start` comes OFF E.6's gesture-guarded list, with the reason written down**, because a guard
   over it throws `WRITER-OUTSIDE-GESTURE` on the ordinary first paint of a prepared workout. That is
   what R2 BLOCKING-3 asks for and it is S-R12's rule applied: a durable writer a paint root reaches
   today is named out loud and carried as its own later ticket.
4. **The ticket is named here so it is not lost**: "the gym card's ready-phase start is a durable
   write taken during a paint", for lane C after the split, and the fence cell carries a row that
   FAILS if a SECOND paint-reached durable PUT ever appears, which is the standing guard around it.

#### The stale-editor fence, the gym paint handle, and SEAM G1

Unchanged from v2 and unchallenged by either review or by the census: `recordSettings` refuses three
times on object identity (`:287`, `:291`, `:311`) and the seal cannot compare an object the view
mints, so `on.settingsEditOpened(liftId)` returns a sealed `editSeq` the view carries beside the
draft, `on.recordSettings(rawDraft, liftId, seq)` refuses unless `seq === editSeq` and
`liftId === editLift`, the seal re-checks the same pair after the await and bumps `editSeq` when it
clears. The cancel control keeps its released `settingsDraft !== paintedDraft` test. **This is
strictly stronger than the identity test it replaces**, because the token is minted and compared
inside the seal.

`createGymSettingsLane` takes a frozen handle of exactly TWO functions, `painter.repaint()` (which is
`paint()`) and `painter.owns()`, which is what the census measures: the only released names the gym
seal touches are `paint` (2 calls) and `owns`. SEAM G1's line-by-line table is unchanged from v2.

#### S-R11: what the design lane is told

The PM rules S-R11 YES. `food-model.cjs`, `sleep-model.cjs` and `machine-settings-view.mjs` are
declared **pinned-unchanged** in S10, and the design lane narrows C-UI-5's and C-UI-7's MAY CHANGE
lines. That closes H.5 item 4: the RULES that decide what gets stored (`refusalFor`, `dayFromEntry`,
`nightFromEntry`, `machineFromDraft`) stop being editable by a look ticket, at zero code cost, by the
mechanism `:542` PM-R3 already uses for `gym-model.mjs` and `checkin-app.mjs`.

**And the five hosts that hold zero DOM are struck.** v2's census stands and I did not re-run it:
`food-host.mjs` (126 lines), `reading-host.mjs` (48), `machine-settings-host.mjs` (113) and
`gym-host.mjs` (88) hold zero `createElement`, `innerHTML`, `textContent`, `classList`,
`querySelector`, `appendChild` or `document.`; `sleep-host.mjs` is free and unneeded by C-UI-7's
acceptance. Striking them removes a sealed path from two tickets at zero code cost.

**No other sealed file is opened by this split.** `today-entry.mjs`, `problem-report.cjs`,
`local-source-basis.mjs`, `import/**` and `measure/**` are not edited; the two dynamic imports move
INTO the seal, which reduces the released surface rather than widening it.

### B.10 What changes in `build.mjs`

`build.mjs` is released by S9 (`DECISIONS:542` (B), with H18), so these are lane C edits, not
sealed-byte moves. They are still laws and none of them is weakened.

| law | line | change | why |
|---|---|---|---|
| `REQUIRED_INPUTS` | `:98` | **ADD two**: `.../today/today-lanes.cjs` and `.../today/gym-settings-lane.mjs`. **48 becomes 50** (S-R18). **The dispute against R1 N1 is WITHDRAWN and R2 BLOCKING-7 is upheld**: counted as ARRAY ELEMENTS, lines matching `^\s*"rebuild/` between `:98` and `:201`, the array holds **48**, of which **26** are `today/**`. I re-measured both at the current tip. v2's 51 came from extracting every quoted literal in that range, which also picks up the quoted strings inside the array's own comment blocks; that method returns 51 or 54 depending on how the apostrophes pair, and it is the method that cannot be trusted here | its purpose (`:112-:115`) is that the page cannot silently lose a module, and a lost lane module is a page that records nothing |
| `REQUIRED_INPUTS` | `:98` | **ADD a third, F.1 being recommended**: `.../today/today-readings.cjs`. **48 becomes 51**, which is the number S-R18 rules | F.1's sibling is a module the page cannot lose either |
| `REQUIRED_INPUTS` teeth | - | **H18 must land first or in the same package**, and its literal list of the `today/**` entries goes from **26 to 29** (S-R18), which makes `package.test.cjs` a DECLARED S10 edit rather than a conditional one (D.3) | v1's finding, unchanged and still a dependency (G) |
| `assertImportRouteIsolation` | `:391` | **`deepEqual(importers.map(...), [SOURCE_REL + "/today-lanes.cjs"])`** | finding 5: the dynamic import moves with `importDeps`. The guard keeps every tooth - one importer, by a dynamic edge - and now points at the SEALED module, which is strictly better than pointing at a file lane C may edit |
| `FORBIDDEN` `:79`, `assertNoNetworkReference` `:209`, `assertNoNodeOnlyGlobals` `:244` | - | no change | |
| bundle order | `:478` | no change | esbuild resolves the new `require`s itself |
| the dash guard's attribution | `:289` | no change, and now it is exactly right | the bundle is cut at `// <path>` banners, and every athlete-facing string still lives in `today-app.cjs`, so the guard still names that file |

**`today-entry.mjs`: ZERO lines change.** `:19` imports `today-app.cjs`; `:44` destructures
`mountToday` and `createTodayModel` off it; both survive by B.7. The pinned file is untouched, and
the build round proves it by comparing `Object.keys(require("./today-app.cjs")).sort()` before and
after and by re-running the `PAGE_PINS` cell.

---

## C. THE TICKET TABLE (NEW - the acceptance test of the cut)

### C.1 Method

Same as v1's: the design of record's state inventory
(`rebuild/m1/approved-2026-09-18/states/STATE-INVENTORY-DRAFT.md`) cites a `today-app.cjs` or
`gym-app.mjs` line for most states, and v1 extracted those citations and mapped them onto the region
map. I did not redo that extraction; I re-used v1's C.2 citation lists unchanged and re-classified
each citation against the NEW cut. The look map's section 2 is the independent second opinion and
the two agree on every ticket.

### C.2 Ticket by ticket
| ticket | what it must change | where that is after the cut | residue |
|---|---|---|---|
| **C-UI-1** design pins, fonts, scene, review hooks | `design.cjs`, `scene.mjs`, `preview.css`, `build.mjs`, `browser-check.mjs` | untouched by this split; freed by S9's two-path list | none |
| **C-UI-2** Today, the face | the copy block, `calorieBand`, `trendLine`, `athleteStateFailureCopy`, `resumeLabel`, `setupNoteNeeded`, `fitHeadline`, `renderToday` `:839-:1025`, `sleepState`, `sampleNote`, `problemControl`, `nutritionState`, `recoveryState`, and `:2440` | **all of it in the released `today-app.cjs`** | **NONE.** v1's residue R4 (`:2440`, the adoption arm) was read, not edited, and it now sits in the sealed half where a reader does not need it: C-UI-2 reads `facade.importAdmitted()` instead |
| **C-UI-3** proposal card and weigh-in | `morningLine`, the proposal binding (new code in `renderToday`), `openWeighIn` `:1028-:1058`, the refusal placement and the field flag at `:1075-:1078` | **all of it in the released `today-app.cjs`** | **NONE.** v1's R1 is gone by SEAM 1: the sentence, the node, the slot name and the fallback string are all on the view side |
| **C-UI-4** the set and rest screens | `renderActive` `:321-:441`, the copy `:30-:78`, the refusal paint at `:423` inside the `logSet` handler | **all of it in the released `gym-app.mjs`** | **NONE**, once B.9's five call sites are behind the table |
| **C-UI-5** workout panels and the settings editor | `machine-settings-view.mjs` (free today), `stub()` `:227-:239` and `settingsPaint` `:242-:282` in `gym-app.mjs`; `machine-settings-host.mjs` needs no edit at all | **all of it in the released `gym-app.mjs` and the free view** | **NONE.** This is the ticket v1 could not free at all |
| **C-UI-6** coach | `:852` and `:909` `put(map, "coach-state", NOT_WIRED)`, and the coach route `:2357-:2358` | **all of it in the released `today-app.cjs`, the router included** | **NONE.** v1's residue R5 and its whole C.4 argument - the screen table, the reseal child for two lines, option (b) refused - vanish. The router is released, so C-UI-6 edits two lines of a file it may edit |
| **C-UI-7** the entries | `renderWhy`, `renderNutrition`, `foodEntry`, `renderSleepCheckIn`, `sleepCheckInOffer`, `renderSleep`, `sleepEntry`, `sleepEstimate`, `sleepStamp`, all of the food and sleep copy, AND the refusal placement the acceptance demands | **all of it in the released `today-app.cjs`**; the refusal placement is B.6's mapper plus SEAM 2's paints | **NONE.** v1's R2 and R3 are gone |
| **C-UI-8** PWA shell and slice deploy | `rebuild/slice/pwa/**`, all free | untouched | none |

### C.3 The residue, measured exactly

**There is none.** Not one look ticket needs a byte of `today-lanes.cjs` or `gym-settings-lane.mjs`.
That is S-R1 (d), and it is the strongest single result of the reversal: v1's five residues R1 to R5
do not need disposing of, they do not exist, because everything that is not a writer is released.

**And the claim beside it, which v2 made in the abstract and R1 showed to be false at seven lines,
is now made over a LIST (R1 BLOCKING-5, BLOCKING-4, BLOCKING-9).** The claim is: after the cut no
released file decides whether or what gets durably written. The evidence for it is B.5's census of
every released-to-sealed assignment with its disposal, plus the three sealed in-flight flags of B.3,
plus the sealed `editSeq` of B.9, plus E.3's red row 13, which fails a released file that assigns
ANY binding declared in a sealed lane module. **The one released line that decides anything after
this round is `mountToken += 1` at `:2296`**, and B.4 argues from the file's own comments that it
governs painting and navigation and never the record. If a reviewer disagrees with that one
argument, the answer is one more callback, not a change of direction.

The honest counter-statement, so the PM has both halves: **a ticket that needs a NEW FIELD out of
the model still rides a child.** C-UI-3's proposal card is the live candidate - the string
`proposal` does not occur in `today-app.cjs` today (blind map section 4, re-checked here: zero
matches) - and if it needs `read()` to compose one, `read()` is in `today-model.cjs`. Section F
keeps `read()` and the whole projection FREE for exactly this reason, so C-UI-3 can add a field
without a child. **That is the same failure mode the PM attributes to v1's frozen view-model, and
the only thing that avoids it is F's decision to leave the projection outside the seal.** If a
later round moves `createTodayModel` into the seal, this result reverses.

### C.4 Is the cut in the right place?

| ticket | before | after v1's cut | after this cut |
|---|---|---|---|
| C-UI-1 | freed by S9 | freed by S9 | freed by S9 |
| C-UI-2 | reseal child | plain lane C | plain lane C |
| C-UI-3 | reseal child | plain lane C, with R1 as a copy constraint | plain lane C, no constraint |
| C-UI-4 | reseal child | **unchanged, still a child** | **plain lane C** |
| C-UI-5 | reseal child | **unchanged, still a child** | **plain lane C** |
| C-UI-6 | reseal child | plain lane C plus a two-line sealed route swap | plain lane C |
| C-UI-7 | reseal child | plain lane C, with R2/R3 as copy constraints | plain lane C, no constraint |
| C-UI-8 | plain lane C | plain lane C | plain lane C |

**Eight of eight, against v1's four freed and two half-freed.** The look map's arithmetic (2 of 8
today, 8 of 8 after two extractions of about 520 lines) is right in its conclusion and wrong in its
measurement; the true figure is **737 lines moved (670 plus 67)**, which is 92 lines per ticket
freed. (v2 said 743 = 663 + 80; B.2 and B.9 are both re-derived after R1.)

---

## D. THE PROOFS (S-R6; v1's section D, kept with the changes S-R6 names)

Six proofs plus the listener census. The build round delivers all seven as artifacts committed
beside its report; its independent reviewer re-runs D.1, D.3 and D.6 from the branch and re-reads
the rest.
### D.1 The move is a SCRIPT, and the proof is the script's own verbatim check (S-R6, S-R17 (b))

v1 and v2 specified a committed `writes-fence.mjs` and `writes-regions.json` that a build round would
write, locating regions by declaration text and hashing bodies. **That instrument now exists, it has
been run at two refs, and it is `rebuild/lanes/c/today-split-spike/cut.cjs` over
`regions.json`.** D.1 is no longer a proof the build round designs; it is a proof it inherits, and
its job is to keep it honest while the interface is added.

**WHAT THE CODEMOD GUARANTEES, measured.** Moved bytes equal source bytes except the substitution
rows declared in `regions.json`. At the current chain tip, over 65 regions:

| | measured |
|---|---|
| anchors resolved | 65 / 65, 0 matching zero places or ambiguously |
| lines moved | 762 |
| lines that move byte for byte with nothing applied at all | **726** |
| substitution rows applied / occurrences | **5 / 5** |
| regions whose bytes differ with no declared row | **0** |
| `node --check` on the output | 6 / 6 |
| regions whose boundary falls inside a statement | 3, all seams, named in B.2 |

`cut.cjs` refuses BY NAME on an anchor that matches zero places, on an occurrence index that does not
exist, on a last anchor it cannot find after the first, on two regions that overlap, and on a move
region whose boundary falls inside a statement. **A region that is in no row of the table is a STOP**,
which is v2's third-block rule carried out by a script instead of by a reader.

**THE DECLARED SUBSTITUTIONS, and which of them are S-R17 (g) STOPs.** A substitution that is a bare
identifier rewrite or a call-target rewrite is ordinary. One that rewrites a statement is not, and
the PM's rule is that it STOPS and is reported. **This spec declares them in advance so the build
round reports them as RULED rather than discovering them**, and each carries its own named cell.

| # | from | to | where allowed | kind | S-R17 (g) |
|---|---|---|---|---|---|
| W1 | `render(` | `painter.repaint(` | any moved region (21 refs, 8 regions) | call-target rewrite | ordinary |
| W2 | `mountToken` | `painter.token()` | `TA-S27`, `TA-S29`, `TA-S30`, `TA-S32` (12 refs) | binding read to a call | **STOP** |
| W3 | `clearSleepDraft()` | `painter.clearDraft()` | **`recordSleep` AND `retrySleepRead`** | call-target rewrite | ordinary |
| W4 | `screen` as a bare read | `painter.screenNow()` | `openSleepLane`, `openFoodLane`, `measureDeps`, `importDeps`, `readSleepCheckIn`, **`rebindWorkout`** | binding read to a call | **STOP** |
| W5 | `sleepErrorText = <expression>` | `sleepOutcome = <outcome literal from B.6>` | `recordSleep`, and `retrySleepRead` for B.6's twelfth row | statement rewrite | **STOP** |
| W6a to W6e | `lastMessage = <object literal>` | `setMessage(<the same literal>)` | `today-model.cjs` `TM-S02` (four) and `TM-S03` (one) | statement rewrite | **STOP, five occurrences** |
| W7 | `paint()` | `painter.repaint()` | `GA-S03`, `GA-S04` | call-target rewrite | ordinary |
| W8 | `const willAdopt = ...` | `willAdopt = ...` with `let willAdopt = null;` at factory scope | `TA-S35`'s boot seam (B.3) | statement rewrite | **STOP** |

**Two corrections the machine made to this list, and both are load-bearing.**

1. **W3's region list was wrong.** D.1 v2 permits the `clearSleepDraft` substitution in `recordSleep`
   only. `CROSSINGS.md` finds four call sites in TWO moved regions: `TA-S29` `:1743` and `:1752`
   (`retrySleepRead`) as well as `TA-S30` `:1870` and `:1919`. Without the correction the manifest
   fails on `retrySleepRead`, which is a whole-move region, and the build round would have been told
   its move was impure when it was not.
2. **W6 is FIVE occurrences, not three.** F.1 (c) prices it at "three lines, in a writer". The sites
   are `:383`, `:388`, `:392` and `:396` inside `weighIn` and `:402` inside `reopen`, and I verified
   all five in the source. **The wired build does not go green without the fourth and the fifth**,
   which is the strongest kind of evidence a substitution row can have.

**And one substitution the machine says is NOT needed.** R2 BLOCKING-6 asks for a W8 substituting
`sleepTyped()` to `typed` inside `sleepClockCheck`. The census classes `sleepTyped` as a SEALED CALLS
A RELEASED FUNCTION row, whose disposition for the whole class is an injected reference, so
`sleepClockCheck` moves byte for byte and `recordSleep:1813` is untouched (B.3). The W8 slot is used
by the boot order instead.

**THE MANIFEST IS `regions.json`**, not a second file and not a hand-written list of 28. Its three
kinds are the three blocks v2 asked for: `move` regions are hashed, `seam` regions are proved by
their named cells, and the declaration blocks are `move` regions like any other because a moved `let`
is a move and not a seam. **PASS is: `cut.cjs` reports 0 regions whose bytes differ with no declared
row, and every declared row's occurrence count equals the number in the table above.** The script
prints the counts, so a region that needed six W1s where the table says two is visible.

**Red-first, unchanged in spirit and cheaper in practice**: run `cut.cjs` on a tree with an
artificial one-character edit inside `recordSleep` and it must fail naming `TA-S30`. Run it with one
anchor's text altered by one character and it must fail naming that region rather than silently
matching the wrong line - which is the failure mode a line-number table has and this one does not.

*Why this is a stronger proof than v1's or v2's:* v1's split moved no writer, so its D.1 proved that
nothing happened. v2's moved all of them and specified a proof nobody had written. This one moves all
of them with a proof that has been run at two refs and whose output has been taken through the whole
today suite once (F.1). **The residue is honest and it is the interface: 282 crossings stand on the
codemod's output, and the two cuts that are pure moves do not run.** That is by design; the spike
does not synthesise an interface, so the census can name what one has to carry.

### D.2 The built page equal before and after (S-R6)

**Byte-identical is still impossible and for the same reason v1 gave**: `build.mjs:289` cuts the
bundle at `// <path>` banners, esbuild wraps each CommonJS input in its own `__commonJS` factory,
and two new `.cjs`/`.mjs` inputs mean two new banners, two new factories and two new call sites.
S-R6 asks whether the new direction makes byte-identity possible. **It does not, and it is not close:
the bundle gains modules either way.** DOM-snapshot equality stands, unchanged from v1's D.2, over
every state the inventory names for T-02..T-95 and W-01..W-40, with the same single normalisation
(sorted attribute order) and the same rule that a state which cannot be driven is listed NOT COVERED
with its reason and judged by the reviewer.

One thing the new direction DOES make cheaper and the build round should take: the input inventory
check (`result.inputs` before and after differs by EXACTLY two paths) is now exact rather than
approximate, because two paths is a number a reader can hold. `scanBuiltAssets`'s dash report must
be empty on both sides.

### D.2b The listener census - KEPT FROM v1, and now it matters more
v1's D.2b is kept verbatim in substance: instrument `EventTarget.prototype.addEventListener` in the
jsdom window for the duration of each state and record a sorted list of
`<data-slot or tag>:<event type>:<count>`; PASS is that list equal, state for state, before and
after. `DECISIONS:454` round 2 found this file's wiring broken once already.

It matters MORE under the new direction, because E.6's gesture shim routes every view listener
through `on.listen`, so every wiring site in the two released files is touched. The census is the
cheapest proof that the wiring survived and it is where the review's time goes first.

### D.3 The today suite green, and the test edit list (S-R6, S-R13, S-R18)

**FOUR required edits, every one a file name or a literal count, none of them an import path, none of
them weakening an assertion.** v2 said three; S-R18 makes `package.test.cjs` the fourth by ruling the
`REQUIRED_INPUTS` counts, and the fourth is therefore DECLARED rather than a STOP.

| cell | line | what it does | edit |
|---|---|---|---|
| the seven cells that import `../today-app.cjs`, the three that import `../today-model.cjs` only, and the two that name `today-app.cjs` as a literal | the imports and the literals | both modules keep their names and their whole export surfaces | **NONE. Zero import paths change.** All nine of v1's import-path edits are avoided |
| **`food.test.mjs:1152-:1153`** | slices `today-app.cjs` between `'function foodEntryFor'` and `'function openFoodLane'` | both declarations move (`TA-S17`, `TA-S18`) | **REQUIRED**: `readRepo('.../today-lanes.cjs')`. One string. **And R2 NOTE-6's ordering constraint is carried by the table**: `regions.json` orders `TA-S17` `:569-:591` before `TA-S18` `:593-:618`, and `cut.cjs` emits moved regions in table order, so `foodEntryFor` is declared before `openFoodLane` in the output by construction |
| **`problem.test.mjs:1100-:1102`** | slices `function sleepEntryFor` by `/^function sleepEntryFor[\s\S]*?^  \}/m` and `Function()`-evals it | the declaration moves (`TA-S11`) | **REQUIRED**: the same one-string change, **and a two-space indentation constraint on `today-lanes.cjs`**, which every moved region meets because every one sits at depth 1 inside `createTodayLanes` |
| **`package.test.cjs:105`** | plants a static import edge on `today-app.cjs`'s node and requires `IMPORT-ROUTE FAIL` | the dynamic import moves with `TA-S19` and `TA-S20` | **REQUIRED**: the planted key becomes `.../today-lanes.cjs`. The red side keeps every tooth |
| **`package.test.cjs`, H18's literal list** | the `today/**` entries of `REQUIRED_INPUTS` | **S-R18** | **REQUIRED, and now declared rather than conditional**: `REQUIRED_INPUTS` is **48** entries today, **26** under `today/`; with `today-lanes.cjs`, `gym-settings-lane.mjs` and `today-readings.cjs` it becomes **51**, and the `today/` literal H18's cell holds becomes **29**. I re-measured both numbers at the current tip: lines matching `^\s*"rebuild/` between `:98` and `:201` number 48, of which 26 contain `w7-preview/today/` |
| `food.test.mjs:696-:698` | slices `today-app.cjs` from `if (next === "setup"` to `if (next === "why")` | the router stays; `TA-M11` rewrites the branch BODY between those two markers | **NONE**, and the reviewer re-reads the slice |
| `copy.test.mjs:406` | plants `const NOT_AVAILABLE = ...` into `today-app.cjs` | `:38` does not move; no copy moves out of the two released view files (B.6) | **NONE** |
| `design.test.cjs:79-:81` | `deepEqual(design.VIEW_SOURCES, [six names])` | `VIEW_SOURCES` is unchanged | **NONE** |
| `problem.test.mjs:2003-:2008` | the `/sleepSpanH\(/` caller list over the whole directory | the one caller is `sleepEstimate:1772`, a drawing region that stays | **NONE, BY DESIGN**: B.3 crosses `sleepSpanH` BY REFERENCE, uncalled in `today-lanes.cjs`. If the build round finds it cannot, that is a FIFTH edit and H.2 stop 5 fires |
| `setup.test.mjs:1035`, `problem.test.mjs:1419-:1423` | code-of scans over drawing lines | nothing they name moves | **NONE** |
| the nine file-name LISTS (`food.test.mjs:707`, `:763`, `:897`; `problem.test.mjs:1945`, `:1980`, `:1989`; `machine-settings-ui.test.mjs:781`, `:841`, `:936`) | the no-dash literal scan, the width scan, the N1.20 custody list | the new modules are not in them | **NOT TAKEN. S-R13 replaces them** |

**S-R13, ruled: the fence asserts ZERO athlete-facing string literals in the sealed lane modules,
instead of D.3's nine widenings.** One new assertion in a new cell instead of nine edits in four
sealed cells; strictly stronger, because it forbids copy in the seal rather than scanning copy that
is there; and it makes B.6's outcome discipline a law. **With the one measured exception B.6 states**:
`today-readings.cjs` carries `TM-S01`'s four refusal constants, two of which are athlete-facing
sentences, so the zero-copy assertion covers `today-lanes.cjs` and `gym-settings-lane.mjs` and
`today-readings.cjs` is declared as carrying exactly four constants, listed by name in the cell, with
a red row for a fifth.

**What the today step actually does on the codemod's output, measured twice, and the two results are
different on purpose.**

| overlay | result |
|---|---|
| **PURE MOVE** (no synthesised interface): `today-app.cjs` / `today-lanes.cjs` and `gym-app.mjs` / `gym-settings-lane.mjs` | `view.test.mjs` is 23 tests, **1 pass / 22 fail**, first failure `ReferenceError: weighIn is not defined` at `today-model.cjs:390`. That is crossing row one of 282, and it is the expected result: the spike leaves the crossings stranded so the census can name them. This row is the spike's; I did not re-run it |
| **WIRED** (`cut.cjs --wire`, the one authored shim for `today-model.cjs` with the seven injections the census derived) | the whole today step, `.github/workflows/rebuild.yml:232`, **`# tests 682` `# pass 682` `# fail 0`**, 328 seconds. **I ran this myself, on a fresh scratch worktree at the current chain tip `70113da5`, alone on the two CPUs.** It is the third independent run of it and the third green |

**So one of the three cuts is not a hypothesis.** The F.1 move - the weigh-in writer and its four
refusal constants out of `today-model.cjs` into a sealed sibling - has been made and stood by the
whole suite, with five declared substitution rows and one seven-key injection. The other two cuts are
pure moves that do not run, and the 282 crossings are exactly why.

**D.4's prediction changes with it**: the expected copy delta is EMPTY for `today-lanes.cjs` and
`gym-settings-lane.mjs`, and exactly `TM-S01`'s four literals for `today-readings.cjs`, with the
multiset over all five files equal. **A FIFTH required test edit is a STOP.**

### D.4, D.5, D.6 - KEPT FROM v1

**D.4 zero copy change.** Unchanged, and now nearly trivial to pass: `copy-census.mjs` extracts
every string literal from `today-app.cjs`, `today-model.cjs`, `gym-app.mjs` and (at HEAD) the two
new files, with the same literal regex `food.test.mjs:899` uses, and emits a SORTED MULTISET with
counts. PASS is equal, exactly. Because B.6 moves no copy, the expected delta in the two new files
is EMPTY, which is a sharper prediction than v1's and a fail if it is not met.

**D.5 the browser check on the PC.** Unchanged: `browser-check.mjs` is stale-red at the tip
(`DECISIONS:535`, and PM-R3 of `:542` keeps it outside CI and run on the PC before each seal), so
the build round records its state BEFORE the split as the baseline and proves NO WORSE after. Both
themes, offline, both the weigh-in and the two entries driven by hand.

**D.6 the numstat.** Unchanged, including v1's widening of the ticket's three paths to seven:
`git diff --numstat <base> HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md
rebuild/authority rebuild/client rebuild/m4 rebuild/conform` prints NOTHING, verbatim in the report
with the base sha named.

---

## E. THE WRITER-FENCE (S-R5; v1's section E, kept and re-aimed)

### E.1 What it is, re-aimed

A new sealed cell, `rebuild/lanes/c/ui-port/writer-fence.test.mjs`, with a CI home of its own beside
the A1/A2/A3/A4 step at `rebuild.yml:232`. v1 aimed it at "every file under `today/` that is not in
the sealed inventory". **S-R5 re-aims it: it fences the RELEASED files BY NAME as well as every file
outside the inventory.** That is not a widening of convenience; it is the only version that means
anything now, because after this split the two most dangerous files in the directory -
`today-app.cjs` and `gym-app.mjs` - are released, and a fence that skipped them would fence nothing
that matters.

### E.2 How it learns which files are free - KEPT FROM v1 unchanged

v1's E.2 stands word for word and I have nothing to add: the inventory is read OUT OF GIT at the
chain ref with no cache; `<N>` is the NUMERIC maximum; two artifacts at the same `N` FAIL
`FENCE-AMBIGUOUS-INVENTORY`; a missing chain ref FAILS `FENCE-CHAIN-REF-ABSENT`; a worktree artifact
differing from the chain FAILS `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`; a reseal-child branch SKIPS
with its reason printed. It is `S9-RELEASE-SPEC.md` D.2's rule and R1 BLOCKING-2's reason: a fence
whose fenceposts move with the animal is not a fence. PM-R3 of `:542` has since ruled the same
thing for the inventory fence, which is a second reason to keep it.

FREE, after S-R5, is: present in the directory listing of `rebuild/m3/w7-preview/today/`, source
files only, `test/` excluded, AND (absent from the inventory's `product` and `executionPins` OR
present in its `released` block). A released file IS fenced; that is now the point.

### E.3 The word list, SPLIT THREE WAYS by measurement (S-R5, S-R12, R2 BLOCKING-2)

R2's BLOCKING-2 is that E.3 built one list from "durable writers" as a CATEGORY rather than from what
each name does, and that four ENTRY callbacks then fail the cell that is supposed to keep the ENTRY
class honest. **The list is split three ways, the split is the one `reach.cjs` runs, and it is
reproducible.**

**PUT - it may put a row of the athlete's on disk (15 names).** `.save`, `.weighIn`, `.logSet`,
`.finish`, `.undo`, `.start`, `.forget`, `.recover`, `.restart`, `.reopen`, `.retract`,
`.retractImport`, `.importBundle`, `.admitLocalSource`, `.commit`.

**STORE - it reaches a store and stores nothing (17 names).** `.all`, `.forDate`, `.latest`, `.rows`,
`.refresh`, `.summary`, `.recorded`, `.today`, `.close`, `.transaction`, `.objectStore`,
`.admittedLocalSourceState`, `.listImports`, `.athleteState`, `.firstRun`, `.recordedLines`,
`.hostForDay`.

**ADOPT - it replaces an in-memory basis or moves a gate; F.2 says these are not durable (7 names).**
`.adoptBasis`, `.setPendingAdoption`, `.setFoodDays`, `.setSleepNights`, `.rebase`,
`.holdForAdoption`, `.adoptEngineState`.

**What each list is FOR, which is the part R2 says was missing:**

| list | the fence | the gesture guard | an ENTRY body |
|---|---|---|---|
| PUT | a released file naming one FAILS `FENCE-WRITER-NAME` | its subject (E.6) | **may not contain one.** An ENTRY callback that gains a PUT is a RED and is reclassified |
| STORE | a released file naming one FAILS `FENCE-WRITER-NAME` | **not its subject** | **may contain one.** Opening a store and reading rows is what an ENTRY callback is for |
| ADOPT | a released file naming one FAILS `FENCE-WRITER-NAME` | **not its subject** | **may contain one**, on F.2's reason: it replaces the in-memory basis `read()` projects from and writes no row |

So all three lists keep every tooth the fence had; what changes is that only PUT is the guard's
subject and only PUT is forbidden inside an ENTRY body. **With that split the four callbacks R2 names
pass:** `openFoodLane` reaches `.all` (STORE) and `.setFoodDays` (ADOPT); `openSleepLane` the same
pair; `readSleepCheckIn` reaches `.forDate` (STORE); `loadCheckInKit` reaches `Promise.all`, whose
receiver the filter marks "not a store". None of the four reaches a PUT.

**Two judgements this spec makes that the spike flagged rather than made.**

1. **`.restart` stays on PUT.** `today-model.cjs:403` `readings.restart()` inside `reopen` is the
   weigh-in correction entry, and a conservative list is the right kind of wrong here.
2. **`.reopen` stays on PUT, and the receiver filter is what keeps it usable.** Keeping it costs
   exactly one false positive, `today-app.cjs:718` `importScreen.reopen()`, and `importScreen` is in
   the NOT-A-STORE-RECEIVER list with its reason written. **That filter is not a verdict on R2
   BLOCKING-8**: `:718` and `:719` ARE a released file driving the sealed import screen, and the
   instrument that catches them is the CENSUS, where `importScreen` is a released READ of a binding
   `TA-S20` moves sealed. Two instruments, one line, and only one of them is the right one for it.

**Lane, host and entry constructors** (unchanged): `createSleepHost`, `createFoodHost`,
`createGymHost`, `createReadingHost`, `createCheckinHost`, `createSetupHost`,
`createMachineSettingsHost`, `createWorkoutEntry`, `createCheckInEntry`, `createSetupEntry`,
`createCheckInModel`, `openTodayHosts`, `openTodayInstallation`, `hostForDay`, `createTodayLanes`,
`createGymSettingsLane`, `createReadingsWriter` - the last three under the RE-EXPORT RULE.
**`createTodayModel` is NOT on that list under F.1 as recommended** (R2 NOTE-7, B.7): the model stays
free and released, and `today-app.cjs:16` keeps its own require.

**Stores** (unchanged): `indexedDB`, `IDBFactory`, `IDBDatabase`, `IDBTransaction`, `IDBObjectStore`,
`openDatabase`, `localStorage`, `sessionStorage`, `caches`, `crypto.subtle`, `navigator.storage`,
`transaction`, `objectStore`.

**Module edges** (unchanged): any import or require of `*-host.mjs`, `*-commands.cjs`,
`local-source-basis.mjs`, `today-entry.mjs`, `../import/**`, `../measure/**`, `rebuild/client/**`,
`rebuild/engine/**`, `rebuild/m4/**`, `rebuild/m3/w6/**`, or of any path in the sealed inventory,
with exactly one declared exception: a released file may import the ONE sealed lane module named as
its partner in the artifact. A second sealed import FAILS `FENCE-SECOND-SEALED-IMPORT`.

**THE RE-EXPORT RULE** (unchanged in shape, corrected in its counts by F.1's fork): a fenced name that
reaches a fenced file only as a re-export is permitted in exactly two positions, the `require` that
destructures it and the export list, and a third occurrence FAILS `FENCE-REEXPORT-USED`. After the
split the fence prints: `createTodayLanes` 2 in `today-app.cjs`, `model` 2, `options` 2;
`createGymSettingsLane` 2 in `gym-app.mjs`. Under F.1 (d) only, `createTodayModel` 2.

**THE NO-CROSSING-ASSIGNMENT RULE, and it is no longer a word list at all.** The fence reads the
DECLARATION LIST of each sealed lane module - every `let`, `const` and `function` at factory scope -
and asserts that no released file contains an ASSIGNMENT to any of those names. **That rule is
exactly `census.cjs`'s RELEASED ASSIGNS A SEALED BINDING class, and the acceptance number is ZERO**
(it is 25 on the codemod's raw output, in 8 regions, B.5). A released `sleepRollover = null` FAILS
`FENCE-SEALED-BINDING-ASSIGNED` naming the binding and the line. It is E.5 red row 13, and it is the
one rule no word list could ever have caught, because `sleepRollover` is not a writer's name.

**What a released view MAY import** (unchanged): `plain-copy.cjs`, `food-model.cjs`,
`sleep-model.cjs`, `problem-report.cjs`, `today-model.cjs`, `machine-settings-view.mjs`,
`checkin-model.cjs`, `design.cjs`, `split-kinds.mjs`, `exercise-catalogue.mjs`, `starter-week.mjs`,
its one sealed partner, and each other. Anything else FAILS `FENCE-VIEW-IMPORT`.

### E.4 How it reads code, and the three false positives R2 measured (S-R5)

v1's method stands: the import side uses `esbuild`'s metafile through the existing `buildToday()`
path; the call side uses a token scan over `codeOf(source)`, the comment-and-string stripper the
today cells already use; the scan is over IDENTIFIERS and MEMBER NAMES, not over call expressions,
which is what makes E.5 row 1 work. **There is no JavaScript parser in the repository's
`node_modules` and this spec does not add one.** The acorn instrument the spike uses is a DEV
instrument in the farm, required by absolute path, never a CI dependency and never copied into any
`node_modules` the repository uses. The fence cell stays a token scan.

**Q7 stays decided as v2 decided it**: `put()` keeps its name and `put`, `add` and `delete` come off
the word list; `transaction`, `objectStore`, `IDBObjectStore` and `IDBTransaction` go on. The name
`put` was never the chokepoint.

**The three false positives R2 measured, each with an exemption and its reason.** R2 is right that a
fence which fails on `Promise.all` loses its credibility the first time it runs, exactly as one that
failed on prose would.

| site, after the cut | line | why it reds | the exemption |
|---|---|---|---|
| `gym-app.mjs` `const latest = entry ? entry.latest : null;` inside the RELEASED `settingsPaint` | `:254` | `.latest` is on STORE and the scan matches member names where they are READ | **RECEIVER EXEMPTION**: `.latest` on `entry`, a cache record, not on a lane identifier. The exemption is written as a receiver name with its reason, the way `writeText` already is |
| `today-app.cjs` `sleepCheckInViewPending = Promise.all([...])` inside the RELEASED `renderSleepCheckIn` | `:1435` | `.all` is on STORE | **RECEIVER EXEMPTION**: `Promise`, `Object`, `Array`, `JSON`, `Math` and `Set` are not stores. This is the same NOT-A-STORE-RECEIVER list `reach.cjs` uses, so the two instruments agree by construction |
| `today-app.cjs` `if (focus) importScreen.reopen();` inside the RELEASED `renderImport` | `:718` | `.reopen` is on PUT | **NO EXEMPTION. The line MOVES.** `regions.json` carries `TA-M03` `:718-:719` as its own declared seam, so after the cut the line is not in a released file and there is nothing to exempt. That is R2 BLOCKING-8's third row answered by removing it |

`navigator.clipboard.writeText` at `problemControl:2213-:2237` keeps its declared PASS: it is a
platform write, not a durable one, `writeText` is absent from all three lists by design and
`navigator.storage` is present. Stated here so nobody adds `.write` later and breaks it.

The rest of v1's policy is kept: `Map.prototype.set`, `Set.prototype.add` and `Array.prototype.push`
are not fenced; `element.remove()`, `.append()`, `.replaceChildren()` are not fenced; a comment
mentioning `host.save` is invisible because `codeOf` strips comments. The fence prints the number of
files it scanned and their names; zero is a FAIL (`FENCE-NOTHING-TO-SCAN`), and so is a run in which
`today-app.cjs` is not among them (`FENCE-RELEASED-FILE-NOT-SCANNED`).

### E.5 Red first (S-R5)

v1's five planted tricks are kept unchanged, with the planted file being `today-app.cjs` in a COPY of
the tree: aliasing `const s = host.save; s(x);` FAILS `FENCE-WRITER-NAME`; computed member
`host['sa' + 've'](x)` FAILS twice; dynamic `await import("./food-host.mjs")` FAILS
`FENCE-VIEW-IMPORT` from the metafile; a writer re-exported through a helper FAILS twice; the
smuggled callback is NOT caught statically, which is E.6.

Plus v1's five structural rows from `S9-RELEASE-SPEC.md` D.2, and:

6. `today-app.cjs` importing `sleep-host.mjs` as well as `today-lanes.cjs` FAILS
   `FENCE-SECOND-SEALED-IMPORT`.
7. `today-app.cjs` calling `createTodayModel(...)` anywhere but its export list FAILS
   `FENCE-REEXPORT-USED`. **Under F.1 as recommended this row is not needed** (R2 NOTE-7); it is
   planted only under F.1 (d).
8. a released file naming `model` or `options` outside the parameter list and the one handoff FAILS
   `FENCE-MODEL-HELD`.
12. a SECOND engine method placed on the facade FAILS `FENCE-ENGINE-WIDENED`.
13. a released file ASSIGNING a binding declared at factory scope in its sealed partner FAILS
    `FENCE-SEALED-BINDING-ASSIGNED`. The planted case is `sleepRollover = null` inside `renderSleep`,
    and the standing acceptance number is the census's own: **zero rows in that class**.
14. a released file CALLING a method on the value returned by `lanes.api.sleepLane()`,
    `lanes.api.workoutEntry()` **or `gymLanes.api.lane()`** FAILS `FENCE-WRITER-NAME`. Three planted
    cases, because B.7 measures three pass-throughs and not one.
15. **NEW, from S-R13**: an athlete-facing string literal in `today-lanes.cjs` or
    `gym-settings-lane.mjs` FAILS `FENCE-COPY-IN-SEAL`, and a FIFTH literal in `today-readings.cjs`
    beyond `TM-S01`'s four named constants fails the same way.
16. **NEW, from S-R12**: a SECOND durable PUT reached from a paint root FAILS
    `FENCE-PAINT-REACHES-PUT`. The one that exists, `gym-app.mjs:546`, is named in the cell as a
    declared exception with its own later ticket, so a third party adding one is a visible diff and
    not a discovery (B.9).

**Eighteen red rows**, against v2's sixteen, R1's thirteen and v1's ten. Every one is planted in a
copy of the tree with the `planted()` pattern `copy.test.mjs:395` already uses, never in the real
tree.

### E.6 The blind spot, and the guard's subject list, MEASURED (S-R5, S-R12, Q3)

**v1's E.6 is KEPT and the case for it is stronger under this direction**, not weaker: a callback the
sealed half hands the view is, to any static reader, just a function, and nothing in the file's text
distinguishes `on.recordIntake(cal, pro)` called from a click listener from the same call made at the
top of a render function. **The spike confirms it by failing to see it**: `REACH.md`'s blind-edge
table has twelve rows, and the twelfth is that after the cut every `on.<callback>` edge is invisible
to the acorn instrument too. A token scan cannot see it; a parser cannot see it; the guard has to be
a RUNTIME guard.

**THE SUBJECT LIST IS `REACH.md`'s, under S-R12's rule: guarded if and only if it reaches a durable
PUT and no paint root reaches it.** Measured, that is NINE callbacks and not twelve:

| callback | the PUT it reaches | paint | boot | listener | guarded |
|---|---|---|---|---|---|
| `on.submitWeighIn` | `model.weighIn():1072` | - | - | SYNC | **YES** |
| `on.recordIntake` | `foodLane.save():1293` | - | - | SYNC | **YES** |
| `on.recordSleep` | `sleepLane.save():1843` | - | - | SYNC | **YES** |
| `on.recoverWorkout` | `workout.recover():954` | - | - | SYNC | **YES** |
| `on.recordSettings` | `settingsLane.save():305` | - | - | SYNC | **YES** |
| `on.logSet` | `model.logSet():419` | - | - | SYNC | **YES** |
| `on.finish` | `model.finish():444` | - | - | SYNC | **YES** |
| `on.forget` | `model.forget():498` | - | - | SYNC | **YES** |
| `on.undo` | `model.undo():505` | - | - | SYNC | **YES** |
| `on.retryFoodRead` | none. `foodLane.refresh():1327` is STORE | - | - | SYNC | **NO, and E.6 v2 had it on** |
| `on.retrySleepRead` | none. `sleepLane.refresh():1732` is STORE | - | - | SYNC | **NO, and E.6 v2 had it on** |
| `on.start` | `model.start():546` | **SYNC** | **SYNC** | SYNC | **NO** (B.9, R2 BLOCKING-3) |

The guard itself is unchanged and is about twelve lines in the sealed half: every guarded entry is
wrapped in `if (!gestureOpen) throw new Error("WRITER-OUTSIDE-GESTURE: " + name)`, where `gestureOpen`
is set true by the sealed half's own `on.listen(el, type, fn)` shim for the duration of the
synchronous part of a DOM event dispatch. The released view installs EVERY listener through
`on.listen`, so a legitimate call passes and a call made during a paint throws.

**Why an ENTRY callback outside a gesture is safe is now a measurement, not an assurance.** The cell
asserts that no ENTRY-class body contains any name on the **PUT** list, which is the corrected form
of the assertion R2 showed contradicting itself, and the four callbacks that would have red it pass
because they reach STORE and ADOPT names only.

**The red-first cell, unchanged in shape:** plant `on.recordIntake()` called from a render path and
assert it throws `WRITER-OUTSIDE-GESTURE` and records nothing, against the real food lane with the
store open; and assert that a view calling `on.openFoodLane()` from `nutritionState` on the first
paint does NOT throw, opens the store exactly once, and paints `FOOD_OPENING`, which is today's
behaviour at `:2245`.

**And one thing the guard does NOT cover, said plainly because S-R12 requires it.** `on.start()` is
unguarded and `gym-app.mjs:546` writes durably during a paint. That is true today, it stays true
after the split, `GA-M06` keeps the line byte-identical, red row 16 stops a second one appearing, and
the ticket to change it is named in B.9. **If the PM refuses new sealed code the blind spot and that
exception both go into the S10 brief in one sentence each, written, not discovered.**

---

## F. `today-model.cjs` (S-R3; v1's section F, re-decided)

### F.1 What moves, and the choice S-R3 asks me to justify

S-R3: "`today-model.cjs`'s writer (`weighIn` `:378` to `:395`) moves to the sealed side (the new
module or a small sealed sibling: choose and justify)".

**I choose a small sealed SIBLING, `rebuild/m3/w7-preview/today/today-readings.cjs`, and I move two
functions into it and nothing else.**

| moves to `today-readings.cjs` (NEW, SEALED) | stays in `today-model.cjs` (FREE, and it should be RELEASED) |
|---|---|
| `weighIn` `:378-:398` | `createTodayModel` `:150-:457` and its whole closure |
| `reopen` `:401-:405` | `read()` `:288-:361` and the whole projection: `storedReads`, `storedFoodDays`, `stateFromOps`, `foodProjectionOf`, `storedSleepNights`, `sessionFor`, `adoptedRead`, `whySections` |
| the FOUR refusal constants those two compose, as the region `TM-S01` `:365-:374`: `ALREADY_RECORDED` `:365`, `FORM_MIN` and `FORM_MAX` `:372`, `OUT_OF_RANGE` `:373-:374` (see (c) for why the range ends at `:374`) | the seven pure top-level functions `clone`, `previewClock`, `engineClockFor`, `createBasisState`, `hasOpenProposal`, `planMove`, `projectionOf` |
| | `adoptBasis` `:412-:420`, `setPendingAdoption` `:423`, `setFoodDays`, `setSleepNights` |
| | the S2 composer `marchingOrderSentence` and `view.orderSentence` (S-R3, and G.2) |

`createTodayModel` composes the sibling: `const w = createReadingsWriter({ day, readings, adoptedRead,
stateFromOps, noStore: NO_STORE, setMessage, read: () => read() });` and puts `w.weighIn` and
`w.reopen` on the object it returns, so the returned surface, the 120-odd `createTodayModel(...)`
call sites, `today-entry.mjs` and `module.exports` `:459-:463` are all unchanged. **The seventh
injection, `read`, is the census's correction to v2 and is load-bearing: `reopen` calls the released
`read()` at `:404` and the wired build does not go green without it** (see (c)).

**The justification, in four parts, because this is the decision most open to disagreement.**

(a) *Why not the new module.* `today-lanes.cjs` is `mountToday`'s partner and is constructed per
mount; `createTodayModel` is constructed by every cell and by `today-entry.mjs:348` without a
document. Putting the reading writer inside `today-lanes.cjs` would make the model depend on the
page's mount, which is a real coupling for no gain.

(b) *Why not move `createTodayModel` whole.* It would make `weighIn` byte-identical (see (c)) and it
would seal `read()` - the 74 lines that compose the whole view DTO. **That reintroduces, in
`today-model.cjs`, precisely the failure the PM attributes to v1's frozen view-model:** a look
ticket that needs one new field on the view goes back through a reseal child. C-UI-3's proposal card
is the live case (C.3). The projection must stay free, so the writer must leave it, not the reverse.

(c) *What it costs, MEASURED, and v2's figures here were wrong in two places.* The spike built this
cut, wired it and ran the whole today suite on it, so this paragraph is the one part of the spec that
is a report rather than a plan.

| | v2 said | the machine says |
|---|---|---|
| the region `TM-S01` takes | `OUT_OF_RANGE` at `:373` | **`:365-:374`**. The declaration runs `:373-:374`, and a cut at `:373` leaves `+ " lb, to one decimal place. Nothing was recorded.";` behind as a valid unary-plus expression statement that `node --check` passes |
| bindings the sibling closes over | six: `adoptedRead`, `stateFromOps`, `day`, `readings`, `lastMessage`, `NO_STORE` | **seven**. `reopen` calls the released `read()` at `:404`, so the shim needs `read: () => read()` and **the wired build does not go green without it** |
| `lastMessage` assignment sites | three | **five**: `:383`, `:388`, `:392` and `:396` inside `weighIn`, and `:402` inside `reopen`. I verified all five in the source |

So W6 is **five declared occurrences**, `W6a` to `W6e` in `regions.json`, each a statement rewrite
(`lastMessage = <object literal>` to `setMessage(<the same literal>)`) and each therefore an
**S-R17 (g) STOP** that D.1 declares in advance. `createTodayModel` composes the sibling with those
seven injections and puts `w.weighIn` and `w.reopen` on the object it returns, so the returned
surface, the 120-odd `createTodayModel(...)` call sites, `today-entry.mjs` and `module.exports` are
all unchanged.

**And this cut has been RUN.** `cut.cjs --wire` produces the pair, and on a fresh scratch worktree at
the chain tip the whole today step (`.github/workflows/rebuild.yml:232`) is
**`# tests 682` `# pass 682` `# fail 0`**, three times, by three hands. If the reviewer will not
accept W6, the honest fallback is still (d) - but the reviewer should know that the thing W6 is
priced for is the only part of this split that is not a hypothesis.

(d) *The fallback, if the PM prefers zero writer rewriting.* Declare `today-model.cjs`
**PINNED-UNCHANGED** in S10, exactly as PM-R3 of `:542` already does for `gym-model.mjs` and
`checkin-app.mjs`. Its bytes are then pinned by the artifact, `weighIn` stays where it is, no look
ticket may edit the file, and the split moves nothing here at all. The cost is that `read()` is then
closed to the look tickets too, which costs C-UI-3 a child if its proposal card needs a field. **I
recommend the sibling; the fallback is cheaper by two hours and worse by one ticket.**

### F.2 The three things that DO NOT move, and why
**`adoptBasis` and `setPendingAdoption` stay free, and this QUALIFIES S-R3's word list.** S-R3 names
`adoptBasis` as a writer no released file may call. After the split no released file calls it: the
call sites are `armAdoptionGate:2435` and `adoptAthleteState:2494`, both of which move into
`today-lanes.cjs`. But `adoptBasis` is still DEFINED in a free file. It writes nothing durable: it
replaces the in-memory basis that `read()` projects from and clears a flag (`:412-:423`, and the
comment there says so). A look ticket that broke it breaks a screen, not a record. **So the fence's
subject is the DURABLE write path, and `adoptBasis` and `setPendingAdoption` are outside it.** If
the PM wants the literal rule instead, they go into `today-readings.cjs` with `weighIn` and `read()`
must then reach them through the sibling - about eight more lines and one more injected accessor,
and I would take the literal rule if the PM says so rather than argue it twice.

**`marchingOrderSentence` and `view.orderSentence` stay free** (S-R3 and `:542` (D)): the composer
is pure over the object the engine returned and the assignment is one line inside `read()`. Under
this direction they need not move at all, which is simpler than v1's F.2, where the composer went to
a new `today-projection.cjs`. **v1's `today-projection.cjs` is not built.** There is no reason for
it once `today-model.cjs` itself is released: the seven pure functions are already free and already
exported, and splitting them out would be a move for its own sake with a `REQUIRED_INPUTS` entry and
a `VIEW_SOURCES` question attached. That is v1's Q8 answered in the negative for the model.

**`gym-model.mjs` and `checkin-app.mjs` stay where they are** and S9 declares them pinned-unchanged
(B.9). The split needs exactly that and nothing more from PM-R3.

---

## G. SEQUENCING (S-R7; v1's section G, re-aimed)

### G.1 Against C-UI-1 - KEPT FROM v1

v1's finding stands and I did not re-measure it: C-UI-1 does not touch `today-app.cjs`; the one
overlap is `build.mjs`, in a different region; C-UI-1 lands first and the split rebases forward onto
it, never the reverse, because the split is the larger and riskier change and it should be the one
that moves.

### G.2 Against `rebuild/c-s9-today-carry` (S-R7)

**The carry lands FIRST.** v1's Q5 is accepted by S-R7 and the reasoning is kept: the carry is
reviewed twice with 0 blocking, `:542` (D) gives it Fable final ACCEPT for carriage in S9, and
holding four lines of drawing code behind a multi-day split costs something and buys nothing.
Landing it first also means the split's D.1 and D.2 baselines are taken on a tree that already has
it.

**Under the new direction its one `today-app.cjs` binding line at `:869` stays exactly where it is**
(S-R7), inside `renderToday`, in the released half. Its `today-model.cjs` hunks -
`marchingOrderSentence` as a new pure top-level function and `view.orderSentence` inside `read()` -
also stay exactly where they are (F.2). **So all three of the carry's hunks are untouched by this
split, in place, with no relocation at all.** v1's G.2 had to describe a three-way relocation if the
carry landed second; that paragraph is now void. If the carry lands second anyway, nothing moves and
nothing needs saying.

One note for the merge, kept from v1 and still true: the carry also edits `design.cjs` (+19/-3),
`adapter.test.mjs`, `view.test.mjs` and `rebuild.yml`. This split does not edit `design.cjs` at all
any more (B.6), so v1's predicted textual conflict there is gone.

### G.3 The design lane bases on the split branch (S-R7)

C-UI-2 through C-UI-7 branch from **the commit the PM names once the build is accepted**, which is
the merge commit of the reseal child that carries the split (G.4), never from the tip before it and
never from the split's own unmerged lane branch.

What each may touch after that commit - and it is a much shorter list of prohibitions than v1's:
| ticket | may touch | may NOT touch |
|---|---|---|
| C-UI-2 | `today-app.cjs`, `screens.template.html`, `design.cjs`, `preview.css`, `checkin-*`, `today-model.cjs` | `today-lanes.cjs`, `today-readings.cjs`, any `*-host.mjs`, `today-entry.mjs` |
| C-UI-3 | as C-UI-2 | as above, plus `today-readings.cjs`'s weigh-in refusals |
| C-UI-4 | `gym-app.mjs`, `gym-model.mjs` (pinned-unchanged: read it, do not edit it), `screens.template.html` | `gym-settings-lane.mjs`, `machine-settings-host.mjs`, `gym-host.mjs` |
| C-UI-5 | `gym-app.mjs`, `machine-settings-view.mjs`, `screens.template.html` | as C-UI-4 |
| C-UI-6 | a new `coach-app.mjs` **imported from `today-app.cjs`, never from `today-entry.mjs`**, and `today-app.cjs` including the router's coach branch | `today-lanes.cjs`, `rebuild/coach/**` |
| C-UI-7 | `today-app.cjs`, `food-model.cjs` and `sleep-model.cjs` **except their refusal halves** (H.5 item 4), `sleep-*`, `screens.template.html` | `today-lanes.cjs`, `food-host.mjs`, `reading-host.mjs` |

Two tickets may run in parallel only if they touch different regions of the same released file.
**This is the one place v1's five-file cut was better and I will say so:** v1 split the view into
five modules precisely so C-UI-2, C-UI-3 and C-UI-7 would not contend in one file, and under this
direction they all edit `today-app.cjs`. The answer is S-R1 (g)'s: **the design lane may modularise
the released view into several files later, freely, as lane C work**, and it should - but it is not
this round's work and it is no longer under the seal, so it costs a lane C ticket rather than a
reseal child. In the meantime C-UI-3 already says "after C-UI-2" in its own SEQUENCING line, and
C-UI-7's regions (`:1086-:1806`) do not overlap C-UI-2's (`:839-:1025`) or C-UI-6's (`:2357`).

### G.4 Which reseal child carries the split, and what the S10 author must be told (S-R14, S-R16)

**S10, not S9** (S-R7, v1's Q4, both accepted and unchanged). S9's spec, its PM token line and its
reviews all say `today-app.cjs` stays sealed; `:542` (A) settles the two-path list; and S10 can USE
the `released` mechanism S9 builds instead of building and using it in one round.

**S-R14, RULED YES, and it is written into the S10 brief in one sentence.** S10 releases
`today-app.cjs` and `gym-app.mjs` AND changes them in the same package, with the changed bytes stood
by the suite, the fence, CI and the design gates rather than by a hash. The mechanism is not a hole
and the reason is in S9's own words: a `released` entry carries `pre` = the parent's pin and
`post: null` (`S9-RELEASE-SPEC.md` H4, "a released file has no post-image in this package"), and walk
1 re-asserts a declared path **in Git at `sourceBase`**, not on disk at HEAD (`:1829-:1833`). So the
release check passes because the bytes at S10's `sourceBase` still equal S9's pin, and the changed
bytes at HEAD are never hashed, because H7 puts the released branch before `const disk = diskSha(file)`.
**That is the trade `:536` recorded in the owner's own words - "the seal's byte-level guarantee over
screen files is given up" - and an S10 reviewer who has not been told will read a package that
changed 700 lines of a file and recorded no hash for them, and call it a hole.**

**G.4 now CITES S9's own argv measurement rather than leaving a reviewer to find it (R2 NOTE-8).**
The ticket's own attack on the `released` role is whether it can carry a file eleven sealed cells
import, which is a child argv dependency. `S9-RELEASE-SPEC.md` at `da9f8683` `:160-:161` measures it:
`packages/S8.json` declares **25 children with 68 distinct argv targets, and every one of the 68 is a
test cell**, so `today-app.cjs` is NOT a child argv target and B.6's rule "a released path must not be
a child argv target" does not reach a module the cells merely IMPORT. It also records the file's
shape in the maps: YES in `product` (role `carried`), NO in `executionPins`, which is the identical
shape `preview.css` and `build.mjs` have. I read those lines at `da9f8683` myself.

**S-R16, RULED: THE BUILD DOES NOT WAIT FOR THE COPY LOCK; THE LANDING DOES.** `DECISIONS:546` makes
the copy lock a named precondition of S10, the child that releases `today-app.cjs`. That is a
precondition of the LANDING, not of the work:

1. **The split is built and reviewed on `rebuild/c-today-split`**, against S9's head, whenever the
   lane is dispatched. Nothing in B, D or E depends on the lock existing.
2. **Its product commits are HELD off the chain until S10 carries them.** If they land on
   `rebuild/t2-client-core` first, S10's `sourceBase` contains them, the `sourceBase` re-assertion of
   `today-app.cjs` against S9's pin fails `PIN-BROKEN-AT-SOURCEBASE`, and there is no third branch.
   **This is the single sequencing mistake that would cost the round a day**, and it is H.2 stop 10.
3. **B.6 is load-bearing for the lock, in the split's favour**: no copy constant moves out of the two
   released view files and `VIEW_SOURCES` does not change, so the lock has the same file list to lock
   after the split as before it. S-R13's zero-copy fence is the same statement made as a law.
4. **H17 must be in S9**, or the release reverses itself at S10 (`:542` (B) ratifies it).

**THE PATHS S10 MUST DECLARE.**

| path | role |
|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | **`released`**, `pre` = S9's pin, `post: null`; the PM token line names it |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | **`released`**, same shape |
| `rebuild/m3/w7-preview/today/today-lanes.cjs` | `new` |
| `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` | `new` |
| `rebuild/m3/w7-preview/today/today-readings.cjs` | `new` (F.1; omitted under F.1 (d)) |
| `rebuild/m3/w7-preview/today/today-model.cjs` | `released` (F.1, recommended) or `pinned-unchanged` (F.1 (d)) |
| `rebuild/m3/w7-preview/today/gym-model.mjs`, `checkin-app.mjs` | `pinned-unchanged`, carried forward from S9's PM-R3 |
| `rebuild/m3/w7-preview/today/food-model.cjs`, `sleep-model.cjs`, `machine-settings-view.mjs` | **`pinned-unchanged` (S-R11, ruled)**, which closes H.5 item 4 |
| `rebuild/m3/w7-preview/today/build.mjs` | already released by S9; the B.10 edits are lane C |
| `rebuild/m3/w7-preview/today/test/food.test.mjs`, `problem.test.mjs`, `package.test.cjs` | `edited` (D.3; `package.test.cjs` twice, for the planted key and for H18's literal under S-R18) |
| `rebuild/lanes/c/ui-port/writer-fence.test.mjs` | `new`, with an execution pin (E) |
| `.github/workflows/rebuild.yml` | `edited`: one new step naming the fence cell by exact path, never globbed (`DECISIONS:117 (4)`, `:186 (3)`) |
| `rebuild/lanes/c/today-split-spike/**` | already committed on the lane branch and **NOT product**: the region table, the codemod, the two census instruments and their tables. The build round runs them; S10 declares nothing for them |

**Three `released` entries and three `new` ones**, against v1's two `edited` and six
`new`-plus-released. v1's stop condition 8 ("six `new` plus `released` is a combination the mechanism
may not support") does not arise, because under this direction nothing is both.

**What must be re-read before S10 declares anything.** S9 was ACCEPTED BY NAME at `DECISIONS:549`
with review R4 as binding corrections, and S9 preparation is running as three parallel lanes. G.4
rests on the `released` role, the RELEASE-FROM-SEAL token line and the chain-derived fence, all three
of which R3 upheld and R4 did not disturb. **If the `released` block's shape changes in preparation,
this section is re-read against it**, and the appendix keeps that warning.

---

## H. RISKS, STOPS, THE BAR, THE ESTIMATE, AND WHAT I REFUSE

### H.1 Risks

| # | risk | how likely | what it costs | what reduces it |
|---|---|---|---|---|
| 1 | **The handler wiring breaks and nobody notices**, as `DECISIONS:454` round 2 already found once in this file | still the highest risk in the ticket, because E.6's shim touches every wiring site | a tap that records nothing, or records twice | D.2b's listener census, and `on.listen` as the single chokepoint to count at. `REACH.md` counts 25 listener installations in `today-app.cjs` and 19 in `gym-app.mjs`, so the census has a number to hit |
| 2 | **A seam changes the ORDER of a write and a paint** without changing either | medium, and there are 25 seams now | a refusal drawn before the write it describes, or a button enabled too early | each seam carries a trace-asserting cell, not an end-state cell. R2 NOTE-3 is settled in B.8 by fixing today's order as the asserted one |
| 3 | **A lane opens at a different moment** because a paint opens an encrypted store as a side effect | low, and the direction is what removes it | the store opens before or after the first paint instead of because of it | `nutritionState` and `sleepState` STAY released and call `on.openFoodLane()` / `on.openSleepLane()` at exactly the line they call the opener today. Nothing moved |
| 4 | **THE BOOT ORDER**, new and the largest thing this round found | **high if the factory is called once and the five boot seams are not declared** | `settleAdoption`'s synchronous `adoptionSettled = !adopting` runs before the first paint, and `paintTodayEntry:770` reads that flag | B.3's five boot seams, the W8 row, and `cut.cjs`'s own boot-order print, which is re-run after the kind changes and compared line for line |
| 5 | **The outcome table misses a path** and a refusal draws nothing | medium, and wider than v2 thought: 22 references, not eleven | a silent refusal, the one thing this page refuses to do | B.6's eight shapes are a frozen table, the mapper is asserted EXHAUSTIVE, and S-R13's fence makes a copy constant left in the seal a RED |
| 6 | **`painter.token()` is called where `mountToken` was READ ONCE** and the value drifts inside a writer | low but real, and W2 is an S-R17 (g) STOP for exactly this | a late save paints over a screen the athlete navigated to | `recordSleep` captures `const token = painter.token()` at `:1839` and compares the captured value. D.1 checks W2's 12 occurrences position by position |
| 7 | **A released file assigns a sealed binding** as six tickets edit it over months | medium over time, and it happened twice already inside two spec rounds | the rollover guard or the acknowledgment cleared from the view again | E.3's rule is `census.cjs`'s own class and the acceptance number is ZERO; E.5 red row 13 plants one |
| 8 | **A callback is put in the wrong CLASS** | **lower than R2 feared**, because the class is now derived from `REACH.md` rather than chosen | a page that throws on its first paint, or a guard that means nothing | the three-way word list, and E.6's cell asserting no PUT name inside an ENTRY body |
| 9 | **A double submit writes twice** | low per gesture | a duplicated durable row | seven sealed in-flight flags (B.3, R2 NOTE-5), with a cell that neuters the DOM flag and asserts one operation |
| 10 | **`machineFromDraft`, `FoodModel.refusalFor` and `SleepModel.refusalFor` are edited by a look ticket** | **closed by S-R11**, which declares all three files pinned-unchanged | a bound silently widened | S-R11, ruled. H.5 item 4 records what it cost: nothing |
| 11 | **The re-export rule is quietly widened** | low, and smaller under F.1 as recommended | the fence stops meaning anything about a name | the fence prints the count on every run |
| 12 | **`gym-app.mjs:546` is "fixed" inside this ticket** | medium, because it is tempting | a behaviour change hidden inside a pure move, which is the failure this whole method exists to prevent | S-R12 forbids it, `GA-M06` keeps the line byte-identical, and E.5 red row 16 stops a SECOND one appearing |

### H.2 STOP conditions

The build round STOPS and reports rather than proceeding when:

1. **H.2 STOP 1 IS REPLACED (S-R17 (g)).** There is no seam COUNT any more. The seam list is the
   machine's, whatever its length: 20 declared regions today and 25 after B.3's boot seams. The STOP
   is instead on **any seam whose RELEASED half decides what is stored** - the 25 RELEASED ASSIGNS A
   SEALED BINDING rows in 8 regions (B.5), each of which the build round reports on by name - and on
   **any substitution that is not a bare identifier or call-target rewrite**, which D.1 declares in
   advance as W2, W4, W5, W6 (five occurrences) and W8.
2. **`cut.cjs` reports any region whose bytes differ with no declared row**, or any anchor that
   matches zero places or ambiguously, or any move region whose boundary falls inside a statement.
3. **A region is in no row of `regions.json`.**
4. **D.2 fails**, or more than three states are NOT COVERED.
5. **D.3 grows to a FIFTH required test edit**, or any edit removes or weakens an assertion rather
   than re-pointing it. (Four are declared: `food.test.mjs`, `problem.test.mjs`, and
   `package.test.cjs` twice under S-R18.)
6. **D.4 fails**: the copy multiset is not equal, or `today-lanes.cjs` or `gym-settings-lane.mjs`
   holds any copy at all, or `today-readings.cjs` holds a fifth constant.
7. **The export surface changes**: `Object.keys(require("./today-app.cjs")).sort()` differs.
7b. **Either MOUNT surface changes**: `Object.keys(api)` or `Object.keys(first.settings)` is not
   equal and in the same order before and after, or `ready` stops being an accessor, or the accessor
   stops observing the setup `done` reassignment.
8. **The PAINT HANDLE needs a SEVENTH entry for Today or a THIRD for the gym card.** Six and two are
   not a design choice any more: they are the count of released names the seal touches
   (`CROSSINGS.md`, 5 bindings and 7 functions, B.5). A seventh means a name the machine did not
   find, and the report says which line forced it.
8b. **An ENTRY-class callback needs a PUT.** It is reclassified DURABLE and guarded; and if
   `REACH.md` then shows a paint root reaching it, S-R12 applies: it is named, left byte-identical
   and carried as its own ticket, never fixed inside a pure move.
9. **E.6's runtime guard cannot be built in twelve lines or thereabouts** without changing what a
   writer does on the happy path. Stop and ask, not stop and abandon.
10. **The split's product commits have already been merged to the chain** when S10 runs (G.4).
11. **NEW: `census.cjs` reports any crossing with no disposition row in B.5.** The build round runs
    it on its own output, not on the codemod's, and the RELEASED ASSIGNS A SEALED BINDING class must
    be ZERO.

### H.3 The bar - KEPT

LANES.md screens tier plus the seal chain's own bar: the 682-test today suite green on both runners
(`rebuild.yml:232`) with only D.3's four edits; the whole `rebuild-public` workflow green on ubuntu
and windows; `python3 quality/gate.py` and `python3 quality/statesheet.py` from the 2026-09-18 pack
with `EARNED_APP` pointed at the preview build, green for `today` and for every T and W state the
suite renders; D.2, D.2b, D.4, D.5 and D.6 committed as artifacts, and D.1 satisfied by `cut.cjs`'s
own report; the writer-fence cell RED first on all eighteen rows of E.5, then green; **`census.cjs`
run on the build round's own output with the assignment class at ZERO**; one independent Opus
reviewer, author is not reviewer, told to disagree, committing ONLY the review file; `--ci --package
S<N>` green and the inventory fence green; the browser check on the owner's PC, both themes, offline.

### H.4 The estimate, re-cost from the other side (S-R9, R2 NOTE-9)

The last three estimates grew by about a fifth each round and both times the addition was interface
the spec had not designed. **This one is costed differently, because the move is now a script that
has been run**: 762 lines of cut and paste come OFF, and what is left is the interface the census
sized. That is why the total still rises: the spec designed an interface for about forty named
bindings and the machine found 282 crossings.

| phase | round 3 | v2's | why it moved |
|---|---|---|---|
| moving the regions | **0.5** | 3 to 4 | `cut.cjs` does it. What remains is re-running it with B.3's five `kind` changes and one range split, and comparing the boot-order print |
| the facade, the callback table, the paint handle, the 15 `model.` renames, seven in-flight flags, and the released side's 119 reads and 42 calls rewritten | **7 to 9** | 4 to 5 | measured, not estimated: 45 facade names, 24 callback names, 6 paint entries, 161 released call sites |
| the two apis written out, with their surface cells | **2 to 3** | 1 to 2 | `gym-app.mjs:569-:579` is a second api nobody had carried |
| the seams, with a trace cell each | **11 to 14** | 8 to 11 (for ten) | 25: 14 in `today-app.cjs`, 6 in `gym-app.mjs`, 5 in the boot. Many are one-liners; `GA-M01` and `TA-M11` are not |
| B.6's outcome table, the mapper character for character, the exhaustiveness cell | **3 to 4** | 2 to 3 | 12 constants across 22 references in 3 regions, not one region's eleven |
| `gym-app.mjs` and `gym-settings-lane.mjs` | **5 to 7** | 5 to 7 | unchanged; `:279` and the second api are inside it |
| `today-readings.cjs` (F.1) | **0.5 to 1** | 1 to 2 | **it exists, it is wired, and the whole today step is green on it.** What remains is transcribing it into the product tree and writing its cell |
| `build.mjs`, the export-surface proof, S-R18's counts | **1** | 1 | |
| the proof scripts of D | **3 to 5** | 5 to 7 | D.1 is inherited from the spike; D.2, D.2b and D.4 remain |
| the test edits of D.3, each re-run red first | **1** | 1 | four now, not three |
| the writer-fence cell, eighteen red rows | **8 to 10** | 7 to 9 | two more rows, and red row 13 now reads a declaration list |
| E.6's runtime guard with the three-way class split | **3 to 4** | 3 to 4 | |
| running the bar, fixing what it finds, the browser check | **4 to 6** | 3 to 5 | the today step is 330 seconds a run on two CPUs and the build round will run it many times |
| the author's report | **2** | 2 | |
| **BUILD ROUND TOTAL** | **51 to 67** | 44 to 60 | |
| **THE INDEPENDENT REVIEW** | **12 to 16** | 12 to 16 | **and it comes DOWN from R2's 14 to 18 for a measured reason**: the census two reviewers had to re-derive by hand is now three commands that run in a minute at either ref, so R4's reading time goes to the interface and the seams instead of to re-counting bindings |

**Per ticket freed: 7.4 hours**, against v1's 8.6 for four freed and two half-freed. The comparison
still favours this direction, and by less again than v2 said - which is the honest shape of the last
three rounds and the PM should keep reading it that way.

**What is NOT in the total, said so it is not assumed**: the gym card's ready-phase start (B.9's
named later ticket), the design lane's own narrowing of C-UI-5 and C-UI-7 under S-R11 (a ticket edit
at zero code cost), and the copy lock, which is S10's precondition and another lane's work (S-R16).

### H.5 What I refuse or qualify in the PM's rulings (S-R8)

**I did not find a reason to STOP, and neither did the machine.** That sentence means more this round
than last, because it is now a measurement rather than a reading: 282 crossings, every one of them
either a read that can be a getter, a call that can be a callback, a paint that can be a handle
entry, a constant that can be re-required, or an assignment that is a declared seam. **Not one of the
282 is a writer that cannot leave its closure**, and the hardest class - the 25 released assignments
- is 25 rows in 8 regions, all of them named.

The three hardest cases are unchanged and all three are answered: the stale-editor fence over an
object identity (B.9 rebuilds it on a sealed token); `sleepNightChoice`, read by the write path (B.5
moves it, a pure move); and `api.ready`, which must stay a live accessor (B.7). **What I will not
claim is that nothing released decides anything**: `mountToken += 1` at `:2296` stays released under
S-R15 and on the file's own words, and `gym-app.mjs:546` writes durably during a paint and is left
exactly as it is under S-R12.

**Four qualifications, three of them now closed by the PM's own rulings.**

1. **Reason (c) is UNDERSTATED and stays so.** Zero import paths change. What remains is four edits
   v1 did not have to make, because v1 moved no writer and these cells slice writers out of the file
   by declaration text.
2. **Reason (e) is right about the code and wrong about the cost, and the gap is now measured.** 762
   lines against 1700 is 45 percent of v1's move; the ROUND is 51 to 67 against v1's 29 to 42. A PM
   choosing on effort should choose v1; a PM choosing on tickets freed, on residue, or on how small
   the sealed surface ends up should choose this.
3. **Reason (f) is a good precedent and it is not the same cut**, unchanged: `measure-view.mjs` and
   `measure-host.mjs` were BUILT in two files, so nobody had to separate 76 closure bindings. **This
   round is the first that can say how many there really are: 100 distinct names, 282 references.**
4. **H.5 item 4 is CLOSED by S-R11.** `food-model.cjs`, `sleep-model.cjs` and
   `machine-settings-view.mjs` are declared pinned-unchanged in S10 and the two MAY CHANGE lines are
   narrowed. That was the last place where a look ticket could change what gets stored, and it cost
   no code. `acceptable` was already right, because its whole body delegates to `machineOf` from a
   file `:536` seals by name.

### H.6 Open questions for the PM

**Two**, against v2's seven. Q1 to Q7 are all ruled (S-R10 to S-R16) and this round carries them out
rather than re-asking them; the two below are new and both come out of the spike.

| # | question | recommendation |
|---|---|---|
| **Q8 (NEW, from the BOOT ORDER)** | B.3 resolves the interleaved boot by keeping the six moved boot statements at their own positions as five calls into `on`, which turns four move regions into seams, splits a fifth, and adds W8 (`const willAdopt` to `let willAdopt` at factory scope), an S-R17 (g) STOP. The alternative is calling the factory at three points, which breaks the one-handoff rule E.3 asserts. | **The five boot seams.** They preserve the order by construction rather than by argument, and the one-handoff rule is worth more than five lines. The PM should know it is a change to the region table and that the build round re-runs `cut.cjs` before anything else |
| **Q9 (NEW, from S-R13 against F.1)** | `today-readings.cjs` takes `TM-S01`'s four refusal constants and two of them are athlete-facing sentences, so the zero-copy fence cannot cover that file the way it covers the other two. Declare the four by name in the cell with a red row for a fifth, or leave the constants in `today-model.cjs` and inject them? | **Declare the four by name.** Injecting them is four more accessors on a writer that is already green, and the wired run proves the move breaks nothing: the whole today step is 682 of 682 with those four constants in the sibling |

Also carried to the PM, not a question: **the design lane should modularise the released
`today-app.cjs` into several files as a lane C ticket after C-UI-2 and C-UI-7 land** (S-R1 (g), G.3).
It is the one thing v1 did better, it is no longer under the seal, and it costs a ticket rather than
a child. **And the gym card's ready-phase durable start (B.9) is a ticket that now exists**, named by
this round and not fixed by it.

---

## Appendix: what I ran, and what I did NOT verify

**What I RAN, in the farm, at the current chain tip `70113da5`:**

1. `node cut.cjs --root <tip> --out out` - 65 of 65 anchors resolved, 762 lines moved, 5 substitution
   rows / 5 occurrences, 0 regions whose bytes differ with no declared row, no line drift, 3
   straddling seam markers and 17 aligned, and the boot-order print.
2. `node census.cjs --root <tip> --out out` - **282 crossings, 100 distinct direction+name**, the six
   class counts, and `CROSSINGS.md` regenerated **byte for byte identical** to the committed copy
   apart from the one line recording the worktree path.
3. `node reach.cjs --root <tip>` - **62 rows** (51 + 7 + 4), 12 blind edges, and **exactly one durable
   PUT reached from a paint root**, `gym-app.mjs:546`. `REACH.md` regenerated byte for byte identical
   to the committed copy apart from the same one line.
4. **The whole today step** (`.github/workflows/rebuild.yml:232`) on the F.1 WIRED output, on a fresh
   scratch worktree at the current tip, alone on the two CPUs: **`# tests 682` `# pass 682`
   `# fail 0`**, 328 seconds. This is the third independent run of that overlay and the third green.
5. Source reads at the current tip confirming, line by line: `gym-app.mjs:279`, `:569-:579`,
   `:419-:420`, `:546`; `today-model.cjs:365-:374` and all five `lastMessage` sites; `today-app.cjs`
   `:422`, `:482`, `:567`, `:668`, `:1435-:1444`, `:1657-:1658`, `:1984-:1986`, `:2002-:2004`,
   `:2196`, `:2297`, `:2300-:2337`, `:2343-:2374`, `:2440-:2441`, `:2451`, `:2528`, `:2550`;
   `build.mjs:98-:201` (**48 entries, 26 under `today/`**); and `S9-RELEASE-SPEC.md:160-:161` at
   `da9f8683`.

**What I did NOT verify:**

1. **I did not re-run the PURE-MOVE overlay.** D.3's row for it (`view.test.mjs` 1 pass / 22 fail,
   `ReferenceError: weighIn is not defined` at `today-model.cjs:390`) is the spike's, run twice by
   two hands, and is labelled as theirs.
2. **I did not re-run at `da9f8683`.** The both-refs claim - 65 of 65, 282, 62, one paint-reached PUT,
   identical row for row with 30 regions resolving one line lower - is the spike's, run twice.
   Re-deriving it is three commands and the PM's reviewer should take them.
3. **I did not run the codemod with B.3's five `kind` changes.** The boot seams are a declared
   revision to `regions.json`, argued from `cut.cjs`'s own boot-order print, and the build round's
   first act is to make the edit and re-run. The lines-moved figure then becomes 679, not 685.
4. **I did not build, seal, package or gate anything.** No `b-package.cjs`, no bundle, no browser, no
   design gate, no soak, no PC test run. Nothing on the owner's data path was opened.
5. **The census's scope is the three files this ticket names.** `machine-settings-view.mjs`,
   `food-model.cjs`, `sleep-model.cjs`, `checkin-model.cjs`, `import/`, `measure/`, every `*-host.mjs`
   and `today-entry.mjs` are NOT measured, and `REACH.md`'s twelve-row blind-edge table is where that
   boundary bites. The twelfth row is the reason E.6's guard must be a runtime guard.
6. **Scope analysis sees bare identifiers.** The roughly 15 released `model.` member reads are a
   reading census, not a machine one (B.3), and the build round closes that by re-running
   `census.cjs` after the handoff rewrite.
7. **C.2's citation lists are v1's**, re-classified; I checked none of them again this round.
8. **I did not read the S9 runner's code**, only `S9-RELEASE-SPEC.md` at `da9f8683`. S9 is ACCEPTED
   BY NAME (`DECISIONS:549`) and in preparation as three parallel lanes; if the `released` block's
   shape changes, G.4 must be re-read before S10 declares anything.
9. **I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory, the
   protected soak, or anything on the owner's data path. The owner's real measurements are not in
   this session, and every fixture named here is synthetic.**
10. **The codemod's OUTPUT is not committed**, by the ticket's own rule; it exists only in farm
    scratch worktrees. `CROSSINGS-s9.md` and `REACH-s9.md` are not committed either: they are the
    same tables with the line numbers below `:869` shifted by one, and the three commands re-derive
    them at either ref.
11. **This document is still a hypothesis**, and it is now a hypothesis with four reproducible
    tables under it. Three hands have attacked the design and a fourth should. **Where a claim has no
    spike row it is marked UNMEASURED in its own section; where the spike contradicts a review, the
    spike wins and this document says so.** Disagree with it where the evidence lets you, re-run the
    three commands, and commit only the review file.